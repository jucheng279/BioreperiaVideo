import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {SHOTS, C} from './design';
import {Opening} from './scenes/Opening';
import {Platform} from './scenes/Platform';
import {Hero} from './scenes/Hero';
import {Therapies} from './scenes/Therapies';
import {Response} from './scenes/Response';
import {Speed} from './scenes/Speed';
import {Applications} from './scenes/Applications';
import {Closing} from './scenes/Closing';

export type FilmProps = {bgm: boolean; sfx: boolean};
export const BioReperiaFilm: React.FC<FilmProps> = ({bgm = true, sfx = true}) => {
  const {fps} = useVideoConfig();
  return <AbsoluteFill style={{backgroundColor: C.ink}}>
    <Sequence name="01 · Tumor variability" from={SHOTS.opening.from} durationInFrames={SHOTS.opening.duration} premountFor={fps}><Opening title={SHOTS.opening.title} duration={SHOTS.opening.duration}/></Sequence>
    <Sequence name="02 · Meet ZTX" from={SHOTS.platform.from} durationInFrames={SHOTS.platform.duration} premountFor={fps}><Platform duration={SHOTS.platform.duration}/></Sequence>
    <Sequence name="03 · Human tumors in zebrafish" from={SHOTS.hero.from} durationInFrames={SHOTS.hero.duration} premountFor={fps}><Hero title={SHOTS.hero.title} duration={SHOTS.hero.duration}/></Sequence>
    <Sequence name="04 · Parallel therapies" from={SHOTS.therapies.from} durationInFrames={SHOTS.therapies.duration} premountFor={fps}><Therapies title={SHOTS.therapies.title} duration={SHOTS.therapies.duration}/></Sequence>
    <Sequence name="05 · Measure response" from={SHOTS.response.from} durationInFrames={SHOTS.response.duration} premountFor={fps}><Response title={SHOTS.response.title} duration={SHOTS.response.duration}/></Sequence>
    <Sequence name="06 · Five days" from={SHOTS.speed.from} durationInFrames={SHOTS.speed.duration} premountFor={fps}><Speed duration={SHOTS.speed.duration}/></Sequence>
    <Sequence name="07 · Two applications" from={SHOTS.applications.from} durationInFrames={SHOTS.applications.duration} premountFor={fps}><Applications duration={SHOTS.applications.duration}/></Sequence>
    <Sequence name="08 · BioReperia" from={SHOTS.closing.from} durationInFrames={SHOTS.closing.duration} premountFor={fps}><Closing title={SHOTS.closing.title} duration={SHOTS.closing.duration}/></Sequence>
    {bgm && <Audio name="Original music · 120 BPM" src={staticFile('audio/bioreperia-music.wav')} premountFor={fps} volume={1}/>}
    {sfx && <Audio name="Scientific motion accents" src={staticFile('audio/bioreperia-sfx.wav')} premountFor={fps} volume={1}/>}
  </AbsoluteFill>;
};
