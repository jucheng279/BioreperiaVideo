"""Original 30-second score for the BioReperia film.

No sampled music or third-party audio. Deterministic oscillator/noise synthesis.
120 BPM; all time values are seconds, with frame conversion left to Remotion.
"""
from pathlib import Path
import json
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io.wavfile import write

OUT = Path(__file__).resolve().parent
SR = 48000
DURATION = 30.0
N = int(SR * DURATION)
RNG = np.random.default_rng(802713)
music = np.zeros((N, 2), np.float64)
percussion = np.zeros_like(music)
effects = np.zeros_like(music)
notes_bus = np.zeros_like(music)
events = []


def hz(note):
    return 440.0 * 2.0 ** ((note - 69) / 12.0)


def timeline(duration):
    return np.arange(round(duration * SR)) / SR


def fade(t, attack, release):
    end = (len(t) - 1) / SR
    a = np.clip(t / attack, 0, 1)
    b = np.clip((end - t) / release, 0, 1)
    return np.sin(a * np.pi / 2) ** 2 * np.sin(b * np.pi / 2) ** 2


def stereo(x, pan=0.0):
    angle = (pan + 1) * np.pi / 4
    return np.stack((x * np.cos(angle), x * np.sin(angle)), axis=1)


def add(bus, x, start, gain=1.0, pan=0.0):
    if x.ndim == 1:
        x = stereo(x, pan)
    pos = int(round(start * SR))
    if pos < 0:
        x = x[-pos:]
        pos = 0
    count = min(len(x), len(bus) - pos)
    if count > 0:
        bus[pos:pos + count] += x[:count] * gain


def filt(x, kind, freq, order=2):
    return sosfilt(butter(order, freq, btype=kind, fs=SR, output='sos'), x, axis=0)


def warm_pad(notes, duration, strength=1.0):
    t = timeline(duration)
    result = np.zeros((len(t), 2))
    for idx, note in enumerate(notes):
        f = hz(note)
        for voice in range(3):
            cents = [-4.7, 0.6, 4.1][voice]
            ff = f * 2 ** (cents / 1200)
            phase = (idx * 0.71 + voice * 1.917)
            # Rounded harmonic spectrum; no sharp sawtooth edge.
            tone = np.sin(2 * np.pi * ff * t + phase)
            tone += 0.22 * np.sin(2 * np.pi * ff * 2 * t + phase * 0.8)
            tone += 0.085 * np.sin(2 * np.pi * ff * 3 * t + phase)
            tone += 0.024 * np.sin(2 * np.pi * ff * 5 * t)
            tone *= 0.96 + 0.04 * np.sin(2 * np.pi * 0.21 * t + idx)
            result += stereo(tone, [-0.72, 0.0, 0.72][voice]) / 18
    result *= fade(t, 0.7, 1.0)[:, None]
    return result * strength


def key(note, duration=1.65, velocity=1.0):
    t = timeline(duration)
    f = hz(note)
    # Felt/rounded plucked keys, fundamental retained under soft upper partials.
    tone = np.zeros(len(t))
    for h, amp, decay in [(1,1.0,0.67),(2,0.28,0.39),(3,0.08,0.25),(4,0.035,0.16)]:
        tone += amp * np.cos(2 * np.pi * f * h * t) * np.exp(-t / decay)
    tone *= fade(t, 0.012, 0.25)
    return tone * velocity


def bass(note, duration):
    t = timeline(duration)
    f = hz(note)
    tone = np.sin(2 * np.pi * f * t) + 0.16 * np.sin(4 * np.pi * f * t)
    tone *= fade(t, 0.012, 0.13)
    tone *= np.exp(-t / 0.55)
    return tone


def kick(strength=1.0):
    t = timeline(0.36)
    f = 47 + 71 * np.exp(-t / 0.019)
    phase = np.cumsum(f) * 2 * np.pi / SR
    tone = np.sin(phase) * np.exp(-t / 0.105)
    click = filt(RNG.normal(0, 1, len(t)), 'lowpass', 1800) * np.exp(-t / 0.004) * .11
    return (tone + click) * fade(t, .0015, .05) * strength


def brush_snare():
    t = timeline(.20)
    noise = filt(RNG.normal(0, 1, len(t)), 'bandpass', [950, 6800])
    body = np.sin(2 * np.pi * 178 * t) * np.exp(-t / .025)
    x = noise * np.exp(-t / .031) * .55 + body * .18
    return x * fade(t, .002, .045)


def soft_hat(opened=False):
    t = timeline(.16 if opened else .07)
    n = filt(RNG.normal(0, 1, len(t)), 'bandpass', [6500, 13500])
    return n * np.exp(-t / (.045 if opened else .014)) * fade(t, .001, .015)


def room(bus, wet=.24):
    dry = bus.copy()
    result = bus.copy()
    # Diffuse, filtered short stereo reflections plus a restrained musical delay.
    for delay, gain, swap in [(.071,.24,0),(.113,.20,1),(.173,.17,0),(.227,.13,1),(.293,.11,0),(.383,.09,1),(.499,.075,0),(.641,.060,1),(.811,.043,0),(.997,.026,1)]:
        sample = int(SR * delay)
        if sample >= len(dry):
            continue
        delayed = filt(dry[:-sample], 'lowpass', 4100 - 2100 * delay)
        if swap:
            delayed = delayed[:, ::-1]
        result[sample:] += delayed * gain * wet
    return result


# Chord changes follow the film's editorial phrases; the final chord is a resolve.
sections = [
    (0,3,[50,57,60,64,65],38,.73,'quiet opening'),
    (3,7,[50,57,60,64,65],38,.86,'platform'),
    (7,11,[46,53,57,60,65],34,1.02,'zebrafish reveal'),
    (11,15,[48,53,57,60,67],29,1.03,'parallel therapies'),
    (15,19,[48,55,60,62,64],36,.96,'response measurement'),
    (19,23,[50,57,60,64,65],38,1.03,'five-day result'),
    (23,27,[46,53,57,60,65],34,1.10,'two applications'),
    (27,30,[41,53,57,60,67],29,1.10,'brand resolve'),
]
for start, end, chord, root, strength, label in sections:
    add(music, warm_pad(chord, end - start + 1.15), start - .22, .32 * strength)
    if start < 27:
        # Harmonic figures stay behind the typography; main movement is rhythmic.
        motif = [chord[1]+12,chord[3]+12,chord[2]+12,chord[4]+12,
                 chord[1]+12,chord[2]+12,chord[3]+12,chord[2]+12]
        step = .5 if start == 0 else .25
        for j, at in enumerate(np.arange(start, end, step)):
            if at < 1.0 or (19 <= at < 20.0) or at >= 26.5:
                continue
            note = motif[j % len(motif)]
            velocity = [.83,.45,.61,.41,.75,.43,.58,.4][j % 8]
            gain = (.040 if start == 0 else .054) * strength
            add(notes_bus, key(note, velocity=velocity), at, gain, (-.32,.25)[j % 2])
        for j, at in enumerate(np.arange(start, end, .5)):
            if at < 3 or (19 <= at < 19.5) or at >= 26.5:
                continue
            add(music, bass(root, .43), at, .13 * strength)

# Contemporary pulse: sparse and rounded, with no aggressive EDM drop.
for beat in range(60):
    at = beat * .5
    if 3 <= at < 27:
        if at < 7 and beat % 2:
            continue
        if 19 < at < 20:
            continue
        gain = .145 if at < 7 else .185
        add(percussion, kick(), at, gain)
        events.append({'t':at,'k':'kick','s':gain})
    if 7 <= at < 26.5 and beat % 2 == 1:
        add(percussion, brush_snare(), at, .10, -.03)
        events.append({'t':at,'k':'snare','s':.10})
    if 7 <= at < 26.5:
        add(percussion, soft_hat(), at + .25, .045, (-.26,.31)[beat % 2])
        events.append({'t':at+.25,'k':'hihat','s':.045})
        if 11 <= at < 19 or 23 <= at < 26:
            add(percussion, soft_hat(), at, .019, -.18)

# Gentle tape-like space for the notes, independent from the kick/bass.
notes_bus = room(notes_bus, .85)
for seconds, gain in [(.375,.20),(.75,.09)]:
    delay = round(seconds * SR)
    notes_bus[delay:] += notes_bus[:-delay, ::-1] * gain
music = room(music, .28) + notes_bus + room(percussion, .12)

# Quiet high held color at the reveal and final resolution, without a chime motif.
for at, note, gain in [(7,77,.024),(19,76,.020),(27,77,.035),(27,81,.020)]:
    add(music, key(note, duration=2.9, velocity=.6), at, gain, -.18)


def air_sweep(duration, peak_time, low=280, high=3800):
    t = timeline(duration)
    x = filt(RNG.normal(0, 1, len(t)), 'bandpass', [low, high])
    env = np.exp(-((t - peak_time) / .22) ** 2)
    env *= fade(t, .12, .27)
    pan = np.linspace(-.75, .75, len(t))
    angle = (pan + 1) * np.pi / 4
    return np.stack([x * env * np.cos(angle), x * env * np.sin(angle)], axis=1)


def soft_impact(duration=1.4, note=38):
    t = timeline(duration)
    f = hz(note)
    tone = np.sin(2*np.pi*f*t) * np.exp(-t/.33)
    body = filt(RNG.normal(0,1,len(t)),'lowpass',800) * np.exp(-t/.07) * .13
    return stereo((tone + body) * fade(t,.006,.25),0)


cue_specs = [
    ('hero-air',6.55,.45,.070,air_sweep(.95,.45,350,4300),'Larva reveal camera pullback'),
    ('measurement-focus',14.75,.25,.036,air_sweep(.75,.25,800,3500),'Response comparison scan'),
    ('five-day-lock',19.0,.02,.080,soft_impact(1.25,38),'Transition into the five-day message'),
    ('brand-air',26.4,.6,.060,air_sweep(1.25,.6,250,3800),'Final brand reveal'),
    ('brand-resolve',27.0,.02,.11,soft_impact(1.65,41),'Transition into the final brand identity'),
]
cue_manifest = []
for name,start,peak,gain,x,purpose in cue_specs:
    shaped = room(x * gain, .33)
    add(effects,shaped,start)
    cue_manifest.append({'name':name,'start':start,'targetPeakSeconds':start+peak,'gainBakedIn':gain,'purpose':purpose,'file':name+'.wav'})

# Soft mastering. A single gain is applied to both stems so the sum is invariant.
t = np.arange(N) / SR
fadeout = np.sin(np.clip((DURATION-t)/1.25,0,1)*np.pi/2) ** 2
fadein = np.sin(np.clip(t/.22,0,1)*np.pi/2) ** 2
music *= (fadein * fadeout)[:,None]
effects *= fadeout[:,None]
music = filt(music,'highpass',26)
effects = filt(effects,'highpass',26)
mixed = music + effects
master_gain = .76 / max(np.max(np.abs(mixed)),1e-9)
music *= master_gain
effects *= master_gain
mixed *= master_gain


def save(name, x):
    write(OUT/name, SR, np.round(np.clip(x,-1,1)*32767).astype(np.int16))


save('bioreperia-music.wav',music)
save('bioreperia-sfx.wav',effects)
save('bioreperia-mix.wav',mixed)
save('percussion-reference.wav',percussion * master_gain)
for name,start,peak,gain,x,purpose in cue_specs:
    save(name+'.wav',room(x*gain,.33)*master_gain)

rms = []
for i in range(60):
    segment = mixed[int(i*.5*SR):int((i+1)*.5*SR)]
    rms.append({'t':i*.5,'dbfs':float(20*np.log10(np.sqrt(np.mean(segment**2))+1e-12))})

report = {
    'title':'Living Evidence',
    'provenance':'Original deterministic synthesis for this film; no third-party music or samples.',
    'durationSeconds':DURATION,'sampleRate':SR,'channels':2,
    'bpm':120.0,'t0':0.0,'T':.5,
    'beats':[i*.5 for i in range(60)],
    'hits':events,'sections':[{'from':a,'to':b,'name':label} for a,b,_,_,_,label in sections],
    'sceneCutsSeconds':[0,3,7,11,15,19,23,27,30],
    'sceneCutGridErrorMs':[0,0,0,0,0,0,0,0,0],
    'rms':rms,
    'cues':cue_manifest,
    'masterGain':float(master_gain),
    'peakDbfs':float(20*np.log10(np.max(np.abs(mixed)))),
    'rmsDbfs':float(20*np.log10(np.sqrt(np.mean(mixed**2)))),
    'mixing':'Use music and SFX stems at volume=1. Their common master gain is already baked in. Do not add the mixed file as well.',
    'renderOffsetNote':'Output AAC offset must be measured from the final rendered film; do not assume a universal priming offset.',
}
(OUT/'beat_data.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ['durationSeconds','sampleRate','peakDbfs','rmsDbfs','masterGain']},indent=2))
