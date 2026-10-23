import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneStage, SceneProps} from '../components';
import {C, tween} from '../design';

export const Applications: React.FC<SceneProps> = ({duration = 130, style}) => {
  const f = useCurrentFrame();
  const exit = 1 - tween(f, duration - 20, duration - 10);
  const line = tween(f, 8, 28);
  return <SceneStage style={style}>
    <div style={{position: 'absolute', top: 115, left: 124, width: 1672, textAlign: 'center', fontSize: 90, fontWeight: 500, lineHeight: 1.16, letterSpacing: '-0.045em', opacity: tween(f, 7, 22) * exit}}>Two applications.<br/><span style={{color: C.ice}}>One platform.</span></div>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: exit}}>
      <path d="M960 410V455Q960 490 925 490H525Q485 490 485 530V565 M960 455Q960 490 995 490H1395Q1435 490 1435 530V565" stroke="#477890" strokeWidth={2} fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - line}/>
      <circle cx={960} cy={410} r={7} fill={C.orange} opacity={line}/>
      <circle cx={485} cy={565} r={5} fill={C.orange} opacity={line}/>
      <circle cx={1435} cy={565} r={5} fill={C.orange} opacity={line}/>
    </svg>
    <div style={{position: 'absolute', left: 124, top: 615, width: 740, opacity: tween(f, 12, 24) * exit, translate: `0px ${tween(f, 12, 26, 22, 0)}px`, textAlign: 'center'}}>
      <div style={{fontSize: 51, fontWeight: 500, letterSpacing: '-0.035em'}}>ZTX<span style={{fontSize: 24, verticalAlign: 'super'}}>®</span> <span style={{color: '#F39466'}}>ONCOLEADS</span></div>
      <div style={{fontSize: 44, fontWeight: 400, color: C.ice, marginTop: 26}}>Drug discovery</div>
    </div>
    <div style={{position: 'absolute', left: 1060, top: 615, width: 740, opacity: tween(f, 16, 28) * exit, translate: `0px ${tween(f, 16, 30, 22, 0)}px`, textAlign: 'center'}}>
      <div style={{fontSize: 51, fontWeight: 500, letterSpacing: '-0.035em'}}>ZTX<span style={{fontSize: 24, verticalAlign: 'super'}}>®</span> <span style={{color: '#F39466'}}>PREDICT</span></div>
      <div style={{fontSize: 44, fontWeight: 400, color: C.ice, marginTop: 26}}>Clinical decision support</div>
    </div>
    <div style={{position: 'absolute', left: 960, top: 635, width: 1, height: 138, background: 'linear-gradient(transparent, #305B72, transparent)', opacity: line * exit}}/>
  </SceneStage>;
};
