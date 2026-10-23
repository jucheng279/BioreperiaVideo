import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneStage, Headline, ScienceCanvas, CameraRig, Dust, SceneProps} from '../components';
import {Zebrafish} from '../biology/Zebrafish';
import {E, tween} from '../design';

export const Hero: React.FC<SceneProps> = ({title = 'Human tumors\nin zebrafish.', duration = 130, style}) => {
  const f = useCurrentFrame();
  // Shotcraft crane: focus and distance share the same eased progress.
  const p = tween(f, 8, 86, 0, 1, E.crane);
  return <SceneStage style={style}>
    <ScienceCanvas>
      <CameraRig position={[-2.7 + 2.7 * p, -1.5 + 2.6 * p, 4 + 14 * p]} target={[-2.7 + 2.7 * p, -1.45 + 1.05 * p, 0]} />
      <group position={[1.15, -1.02, 0]} scale={1.17} rotation={[0.10, -0.28 + p * 0.35, -0.13]}>
        <Zebrafish frame={f + 210} />
      </group>
    </ScienceCanvas>
    <Dust frame={f + 210} amount={32} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 1200, height: 460, background: 'radial-gradient(ellipse at 20% 0%, rgba(3,27,43,0.8), transparent 70%)'}} />
    <Headline y={112} width={1050} size={100} end={duration - 10}>{title}</Headline>
    <div style={{position: 'absolute', right: 128, bottom: 82, fontSize: 44, opacity: tween(f, 60, 80) * (1 - tween(f, 112, 120)), color: '#B7D7E7'}}>Scientific illustration</div>
  </SceneStage>;
};
