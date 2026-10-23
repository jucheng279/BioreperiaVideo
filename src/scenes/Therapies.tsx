import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneStage, Headline, ScienceCanvas, CameraRig, SceneProps} from '../components';
import {Zebrafish} from '../biology/Zebrafish';
import {C, E, tween} from '../design';

const ModelWell: React.FC<{x: number; frame: number}> = ({x, frame}) => <group position={[x, -0.65, 0]}>
  <mesh rotation={[-Math.PI / 6, 0, 0]} position={[0, -0.45, -0.7]} renderOrder={-10}>
    <cylinderGeometry args={[2.65, 2.6, 0.12, 80]} />
    <meshStandardMaterial color="#A6CEDF" transparent opacity={0.10} depthWrite={false} roughness={0.35} metalness={0.2}/>
  </mesh>
  <mesh rotation={[Math.PI / 3, 0, 0]} position={[0, -0.40, -0.73]} renderOrder={-9}>
    <torusGeometry args={[2.65, 0.017, 8, 96]} />
    <meshBasicMaterial color="#7CA8D0" transparent opacity={0.6} depthWrite={false}/>
  </mesh>
  <group scale={0.39} rotation={[0.06, -0.08, -0.12]}><Zebrafish frame={frame} detail={false}/></group>
</group>;

export const Therapies: React.FC<SceneProps> = ({title = 'Test therapies side by side.', duration = 130, style}) => {
  const f = useCurrentFrame();
  // Shotcraft multiplane: one rail driver, distinct depth-speed factors.
  const drive = tween(f, 0, 88, 1, 0, E.rail);
  return <SceneStage light style={style}>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.23, translate: `${drive * -80 * 0.35}px 0px`}}>
      <path d="M96 786H1824 M390 440V850 M960 440V850 M1530 440V850" stroke="#88B3CA" strokeWidth={1}/>
      <ellipse cx={960} cy={648} rx={1060} ry={350} fill="none" stroke="#9FC0D0" strokeWidth={1}/>
    </svg>
    <ScienceCanvas light>
      <CameraRig position={[drive * 1.15 * 0.7, 0.9, 18.9]} target={[0, 0, 0]} />
      <ModelWell x={-6.0 + drive * 0.45} frame={f + 330}/>
      <ModelWell x={0} frame={f + 330}/>
      <ModelWell x={6.0 - drive * 0.45} frame={f + 330}/>
    </ScienceCanvas>
    <Headline width={1690} size={96} color={C.navy} end={duration - 10}>{title}</Headline>
    <div style={{position: 'absolute', inset: 0, translate: `${drive * 180 * 1.4}px 0px`, opacity: 0.06}}>
      <div style={{position: 'absolute', right: -80, top: 810, width: 600, height: 180, background: C.blue, borderRadius: '50%', filter: 'blur(45px)'}}/>
    </div>
    {['Therapy A', 'Therapy B', 'Therapy C'].map((label, i) => <div key={label} style={{position: 'absolute', left: 222 + i * 572, top: 810, width: 330, textAlign: 'center', opacity: tween(f, 18 + i * 4, 38 + i * 4) * (1 - tween(f, 112, 120))}}>
      <div style={{height: 5, width: 34, background: C.orange, margin: '0 auto 20px', borderRadius: 3}}/>
      <div style={{fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em'}}>{label}</div>
    </div>)}
  </SceneStage>;
};
