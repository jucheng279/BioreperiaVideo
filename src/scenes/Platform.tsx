import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneStage, ScienceCanvas, CameraRig, Caption, SceneProps} from '../components';
import {TumorCluster} from '../biology/Zebrafish';
import {C, tween} from '../design';

export const Platform: React.FC<SceneProps> = ({duration = 130, style}) => {
  const f = useCurrentFrame();
  const intro = tween(f, 8, 28);
  const exit = 1 - tween(f, duration - 20, duration - 10);
  return <SceneStage light style={style}>
    <div style={{position: 'absolute', left: 943, top: 120, width: 920, height: 920, borderRadius: '50%', background: 'radial-gradient(circle at 40% 30%, #124F6A, #031B2B 68%, #02121D)', boxShadow: '0 32px 90px rgba(7,68,112,0.14)', scale: tween(f, 0, 80, 1.08, 1)}} />
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.35}}>
      <circle cx={1403} cy={580} r={476} fill="none" stroke={C.navy} strokeWidth={1}/>
      <circle cx={1403} cy={580} r={452} fill="none" stroke={C.paper} strokeOpacity={0.35} strokeWidth={1}/>
      <path d="M1383 97H1423 M1383 1063H1423 M920 560V600 M1886 560V600" stroke={C.orange} strokeWidth={3}/>
    </svg>
    <div style={{position: 'absolute', inset: 0, clipPath: 'circle(460px at 1403px 580px)'}}>
      <ScienceCanvas>
        <CameraRig position={[0, 0, 18]} />
        <group position={[4.6, -0.4, 0]} rotation={[0.25, -0.2 + f * 0.002, -0.15]}>
          <TumorCluster frame={f + 90} scale={1.98} cellCount={64} />
        </group>
      </ScienceCanvas>
    </div>
    <div style={{position: 'absolute', left: 124, top: 275, opacity: intro * exit, translate: `0px ${(1 - intro) * 32}px`}}>
      <div style={{fontSize: 76, fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 1.2}}>Meet</div>
      <div style={{fontSize: 235, fontWeight: 500, letterSpacing: '-0.075em', lineHeight: 1.2}}>ZTX<span style={{fontSize: 64, verticalAlign: 'top', display: 'inline-block', paddingTop: 32, marginLeft: 8}}>®</span><span style={{color: C.orange}}>.</span></div>
    </div>
    <Caption y={795} size={44} color={C.navy} opacity={tween(f, 24, 44) * exit}>Zebrafish tumor xenografts</Caption>
    <div style={{position: 'absolute', left: 124, top: 738, width: tween(f, 16, 54, 0, 640), height: 2, background: C.orange, opacity: 0.7 * exit}} />
  </SceneStage>;
};
