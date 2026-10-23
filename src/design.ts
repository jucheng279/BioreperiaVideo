import {loadFont} from '@remotion/fonts';
import {Easing, interpolate, staticFile} from 'remotion';

void Promise.all([
  loadFont({family: 'Poppins', url: staticFile('fonts/Poppins-Light.woff2'), weight: '300'}),
  loadFont({family: 'Poppins', url: staticFile('fonts/Poppins-Regular.woff2'), weight: '400'}),
  loadFont({family: 'Poppins', url: staticFile('fonts/Poppins-Medium.woff2'), weight: '500'}),
  loadFont({family: 'Poppins', url: staticFile('fonts/Poppins-Bold.woff2'), weight: '700'}),
]);

export const C = {
  navy: '#074470', ink: '#031B2B', deep: '#02131F', orange: '#E8642C',
  paper: '#FFFDFA', pale: '#F6F4F2', blue: '#5085B5', ice: '#B7D7E7',
};
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  crane: Easing.bezier(0.2, 0, 0.25, 1),
  rail: Easing.bezier(0.45, 0, 0.18, 1),
};
export const tween = (frame: number, start: number, end: number, a = 0, b = 1, ease = E.out) =>
  interpolate(frame, [start, end], [a, b], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const hash = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return v - Math.floor(v);
};

export const SHOTS = {
  opening: {from: 0, duration: 100, title: 'Every tumor\nresponds differently.'},
  platform: {from: 90, duration: 130, title: 'Meet ZTX®.'},
  hero: {from: 210, duration: 130, title: 'Human tumors\nin zebrafish.'},
  therapies: {from: 330, duration: 130, title: 'Test therapies side by side.'},
  response: {from: 450, duration: 130, title: 'Measure tumor response.'},
  speed: {from: 570, duration: 130, title: 'Results in five days.'},
  applications: {from: 690, duration: 130, title: 'Two applications. One platform.'},
  closing: {from: 810, duration: 90, title: 'Changing the gameplan\nfor cancer patients.'},
} as const;

export const TOTAL = 900;
