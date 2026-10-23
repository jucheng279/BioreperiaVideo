# BioReperia — “Living Evidence” soundtrack

An original, procedurally composed 30-second instrumental score created for this film. All audio is synthesized from mathematical oscillators and seeded noise by `compose.py`; it contains no sampled songs, stock music, recordings, or third-party sound effects.

## Use in the film

- `bioreperia-music.wav`: the music stem, 48 kHz / stereo / 16-bit PCM, exactly 30.000 seconds.
- `bioreperia-sfx.wav`: the sound-design stem, same format and duration.

The source package includes these two stems, `compose.py` and `beat_data.json`. Running the generator also produces a combined listening mix and individual cue WAVs for optional retiming; those extra files are not required by the film. Do not add a combined mix on top of the separate stems.

Place both WAV stems at time 0 with `volume={1}`. Their shared mastering gain is already applied. A `bgm` option should control only the music stem; the SFX stem stays active when music is disabled. If the finished film needs quieter audio overall, lower both stems together.

## Musical direction

120 BPM, with a quiet opening, evolving stereo pads, warm muted keys, a rounded bass/pulse, restrained percussion, and a held final chord beginning at 27 seconds. The harmonic colors move through Dm9, B♭maj7, Fmaj9, and Cadd9 before a final F-major resolution. There is no voiceover.

The opening has no kick. Percussion enters gently at 3 seconds, gains detail at 7 seconds, and leaves at 27 seconds so the brand lockup can breathe. The score fades to digital silence by the final frame.

## Sound-design cues

| Cue | File start | Intended visual anchor | Purpose |
| --- | ---: | ---: | --- |
| Hero air | 6.550 s | 7.000 s | Pullback into the larva reveal |
| Measurement focus | 14.750 s | 15.000 s | Change to the response comparison |
| Five-day transition | 19.000 s | About 19.020 s | Rounded low emphasis on the cut into the five-day message |
| Brand air | 26.400 s | 27.000 s | Gentle lead into the final identity |
| Brand resolve | 27.000 s | About 27.020 s | Warm accent on the cut into the final identity; the wordmark settles afterward |

Individual cue WAVs can be regenerated for retiming if the visual anchors change. The full SFX stem is used for the approved timing. `beat_data.json` contains authored beat positions, percussion events, cue metadata, sections, and measured half-second RMS values. The 120 BPM grid comes directly from the synthesis timeline; it is not a guessed tempo from beat detection.

## Technical verification

- Each main WAV: 1,440,000 samples per channel, 48,000 Hz, 2 channels, exactly 30 seconds.
- Combined sample peak: −2.384 dBFS.
- Combined true peak measured with FFmpeg loudnorm: −2.38 dBTP.
- Integrated loudness measured with FFmpeg loudnorm: −16.89 LUFS.
- Loudness range: 4.30 LU.
- No clipped samples; first and last samples are zero.
- The difference between the summed quantized stems and quantized mix is at most 1 LSB, from independent 16-bit rounding.
- All planned scene changes (0, 3, 7, 11, 15, 19, 23, 27, and 30 seconds) are exactly on the authored 120 BPM grid.

The measurements above describe the source stems. Final encoded-film verification and its limits are recorded separately in `out/QA-REPORT.md` at the project root. No universal AAC audio-priming offset is assumed here.

## Reproduce

From the project root, run `python3 public/audio/compose.py` with NumPy and SciPy installed. This regenerates the PCM stems, combined mix, individual cues and beat metadata deterministically in `public/audio/`. Python is needed only to regenerate the sound, not to preview or render using the included stems.
