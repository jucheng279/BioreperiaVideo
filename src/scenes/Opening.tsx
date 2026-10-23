import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneStage, Headline, ScienceCanvas, CameraRig, Dust, SceneProps} from '../components';
import {TumorCluster} from '../biology/Zebrafish';
import {C, tween} from '../design';

export const Opening: React.FC<SceneProps> = ({title = 'Every tumor\nresponds differently.', duration = 100, style}) => {
  const f = useCurrentFrame();
  return <SceneStage first style={style}>
    <ScienceCanvas>
      <CameraRig position={[tween(f, 0, 90, 0.7, 0.1), 0.7, tween(f, 0, 90, 18.6, 17.5)]} target={[0, 0, 0]} />
      <group position={[4.1, -0.18, 0]} rotation={[0.24, -0.35 + f * 0.0016, -0.16]}>
        <TumorCluster frame={f} scale={2.3} cellCount={64} />
      </group>
      <group position={[-9.8, 3.5, -4]} scale={0.8}><TumorCluster frame={f} color="#5085B5" opacity={0.22} cellCount={16} /></group>
    </ScienceCanvas>
    <Dust frame={f} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(3,27,43,0.96) 0%, rgba(3,27,43,0.83) 24%, rgba(3,27,43,0.1) 53%, transparent 70%)'}} />
    <div style={{position: 'absolute', left: 126, top: 240, width: 54, height: 5, borderRadius: 3, background: C.orange, opacity: tween(f, 0, 12)}} />
    <Headline x={124} y={300} width={880} size={104} delay={2} end={duration - 10}>{title}</Headline>
  </SceneStage>;
};
