import {C, SHOTS, TOTAL} from './design';
import {BioReperiaFilm} from './Film';
import {Opening} from './scenes/Opening';
import {Platform} from './scenes/Platform';
import {Hero} from './scenes/Hero';
import {Therapies} from './scenes/Therapies';
import {Response} from './scenes/Response';
import {Speed} from './scenes/Speed';
import {Applications} from './scenes/Applications';
import {Closing} from './scenes/Closing';

const headline = (text: string) => [
  {type: 'textarea' as const, key: 'title', label: 'Headline', default: text},
];

/**
 * Shotcraft's structural manifest. SHOTS is also used directly by Film.tsx.
 * The ten-frame overlaps and SceneStage fades are already inside the scenes;
 * a second transition layer would change the imported film.
 */
export const WORKBENCH = {
  name: 'BioReperia · See the response',
  fps: 30,
  width: 1920,
  height: 1080,
  total: TOTAL,
  background: C.ink,
  shots: [
    {
      id: 'opening', label: '01 · Tumor variability',
      from: SHOTS.opening.from, duration: SHOTS.opening.duration,
      component: Opening,
      props: {title: SHOTS.opening.title, duration: SHOTS.opening.duration},
      schema: headline(SHOTS.opening.title), durationProp: 'duration',
    },
    {
      id: 'platform', label: '02 · Meet ZTX',
      from: SHOTS.platform.from, duration: SHOTS.platform.duration,
      component: Platform,
      props: {duration: SHOTS.platform.duration},
      schema: [], durationProp: 'duration',
    },
    {
      id: 'hero', label: '03 · Human tumors in zebrafish',
      from: SHOTS.hero.from, duration: SHOTS.hero.duration,
      component: Hero,
      props: {title: SHOTS.hero.title, duration: SHOTS.hero.duration},
      schema: headline(SHOTS.hero.title), durationProp: 'duration',
    },
    {
      id: 'therapies', label: '04 · Parallel therapies',
      from: SHOTS.therapies.from, duration: SHOTS.therapies.duration,
      component: Therapies,
      props: {title: SHOTS.therapies.title, duration: SHOTS.therapies.duration},
      schema: headline(SHOTS.therapies.title), durationProp: 'duration',
    },
    {
      id: 'response', label: '05 · Measure response',
      from: SHOTS.response.from, duration: SHOTS.response.duration,
      component: Response,
      props: {title: SHOTS.response.title, duration: SHOTS.response.duration},
      schema: headline(SHOTS.response.title), durationProp: 'duration',
    },
    {
      id: 'speed', label: '06 · Five days',
      from: SHOTS.speed.from, duration: SHOTS.speed.duration,
      component: Speed,
      props: {duration: SHOTS.speed.duration},
      schema: [], durationProp: 'duration',
    },
    {
      id: 'applications', label: '07 · Two applications',
      from: SHOTS.applications.from, duration: SHOTS.applications.duration,
      component: Applications,
      props: {duration: SHOTS.applications.duration},
      schema: [], durationProp: 'duration',
    },
    {
      id: 'closing', label: '08 · BioReperia',
      from: SHOTS.closing.from, duration: SHOTS.closing.duration,
      component: Closing,
      props: {title: SHOTS.closing.title, duration: SHOTS.closing.duration},
      schema: headline(SHOTS.closing.title),
      // Closing deliberately holds its resolved logo; it has no timed exit.
    },
  ],
  sfx: [{
    from: 0, duration: TOTAL, src: 'audio/bioreperia-sfx.wav', volume: 1,
    label: 'Scientific motion accents',
  }],
  bgm: [{
    from: 0, duration: TOTAL, src: 'audio/bioreperia-music.wav', volume: 1,
    label: 'Original music · 120 BPM',
  }],
  original: BioReperiaFilm,
};
