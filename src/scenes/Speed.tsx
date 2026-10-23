import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneStage, SceneProps} from '../components';
import {C, E, tween} from '../design';

export const Speed: React.FC<SceneProps> = ({duration = 130, style}) => {
  const f = useCurrentFrame();
  const intro = tween(f, 5, 24);
  const exit = 1 - tween(f, duration - 20, duration - 10);
  const arc = tween(f, 4, 66, 0, 1, E.crane);
  const angle = -Math.PI / 2 + arc * Math.PI * 2;
  return <SceneStage light style={style}>
    <div style={{position: 'absolute', left: 124, top: 353, width: 840, fontSize: 100, fontWeight: 500, lineHeight: 1.16, letterSpacing: '-0.045em', opacity: intro * exit, translate: `0px ${(1 - intro) * 30}px`}}>Results in<br/><span style={{color: C.orange}}>five days.</span></div>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: exit}}>
      <circle cx={1374} cy={530} r={352} stroke="#D6E1E7" strokeWidth={2} fill="none"/>
      <circle cx={1374} cy={530} r={352} stroke={C.orange} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - arc} transform="rotate(-90 1374 530)"/>
      {[0, 1, 2, 3, 4].map(i => {
        const a = -Math.PI / 2 + i / 5 * Math.PI * 2;
        return <circle key={i} cx={1374 + Math.cos(a) * 352} cy={530 + Math.sin(a) * 352} r={5} fill={C.paper} stroke={C.orange} strokeWidth={2}/>;
      })}
      <circle cx={1374 + Math.cos(angle) * 352} cy={530 + Math.sin(angle) * 352} r={10} fill={C.orange}/>
    </svg>
    <div style={{position: 'absolute', left: 1040, top: 208, width: 665, textAlign: 'center', opacity: intro * exit, scale: tween(f, 0, 42, 0.91, 1)}}>
      <div style={{fontSize: 420, fontWeight: 300, lineHeight: 1.23, letterSpacing: '-0.075em', color: C.orange, paddingRight: 28}}>5</div>
      <div style={{fontSize: 48, fontWeight: 500, lineHeight: 1, letterSpacing: '0.16em', color: C.navy, marginTop: -15}}>DAYS</div>
    </div>
  </SceneStage>;
};
