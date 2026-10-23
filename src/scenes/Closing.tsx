import React from 'react';
import {CanvasImage, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneStage, SceneProps} from '../components';
import {C, E, tween} from '../design';

export const Closing: React.FC<SceneProps> = ({title = 'Changing the gameplan\nfor cancer patients.', style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const collapse = tween(f, 0, 24, 5.4, 1, E.smooth);
  const ringOpacity = 1 - tween(f, 8, 24);
  return <SceneStage light style={style}>
    <div style={{position: 'absolute', left: 770, top: 350, width: 380, height: 380, borderRadius: '50%', border: '2px solid #E8642C', scale: collapse, opacity: ringOpacity}}/>
    <div style={{position: 'absolute', left: 500, top: 326, width: 920, opacity: tween(f, 12, 28), scale: tween(f, 12, 34, 0.96, 1)}}>
      <CanvasImage name="BioReperia official wordmark" src={staticFile('brand/bioreperia-logo.png')} premountFor={fps} style={{width: 920, height: 165.54}}/>
    </div>
    <div style={{position: 'absolute', left: 250, top: 571, width: 1420, textAlign: 'center', whiteSpace: 'pre-line', fontSize: 68, fontWeight: 400, lineHeight: 1.36, letterSpacing: '-0.025em', color: C.navy, opacity: tween(f, 23, 37), translate: `0px ${tween(f, 23, 42, 15, 0)}px`}}>{title}</div>
    <div style={{position: 'absolute', left: 600, top: 830, width: 720, textAlign: 'center', fontSize: 44, fontWeight: 400, letterSpacing: '0.01em', color: C.navy, opacity: tween(f, 32, 46)}}>bioreperia.com</div>
  </SceneStage>;
};
