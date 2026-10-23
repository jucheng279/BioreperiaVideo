import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneStage, Headline, SceneProps} from '../components';
import {C, E, hash, tween} from '../design';

const cells = Array.from({length: 145}, (_, i) => {
  const a = hash(i + 62) * Math.PI * 2;
  const r = Math.sqrt(hash(i + 910));
  return {x: 750 + Math.cos(a) * r * 520, y: 305 + Math.sin(a) * r * 220, r: 7 + hash(i + 491) * 20, keep: hash(i + 342) > 0.53, red: hash(i + 34) > 0.55};
});

const FluorescenceField: React.FC<{after?: boolean}> = ({after}) => <svg width={1672} height={600} viewBox="0 0 1672 600" style={{position: 'absolute', inset: 0}}>
  <defs>
    <radialGradient id={after ? 'field-after' : 'field-before'}><stop offset="0" stopColor="#123D53"/><stop offset="1" stopColor="#041C2C"/></radialGradient>
    <radialGradient id={after ? 'cell-after' : 'cell-before'}><stop offset="0" stopColor="#FFE1A9"/><stop offset=".38" stopColor="#F99A48"/><stop offset=".7" stopColor="#EA5E23" stopOpacity=".75"/><stop offset="1" stopColor="#E8642C" stopOpacity="0"/></radialGradient>
    <filter id={after ? 'glow-after' : 'glow-before'}><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <rect width={1672} height={600} fill={`url(#${after ? 'field-after' : 'field-before'})`}/>
  {Array.from({length: 210}, (_, i) => <ellipse key={`bg${i}`} cx={hash(i + 55) * 1672} cy={hash(i + 764) * 600} rx={2 + hash(i + 35) * 19} ry={2 + hash(i + 935) * 10} fill="#1F6C87" opacity={0.05 + hash(i + 84) * 0.18}/>) }
  <g filter={`url(#${after ? 'glow-after' : 'glow-before'})`} opacity={0.58}>
    {cells.filter(c => !after || c.keep).map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.r * 1.12} fill={c.red ? '#EF672E' : '#F4A747'}/>)}
  </g>
  {cells.filter(c => !after || c.keep).map((c, i) => <g key={i}>
    <ellipse cx={c.x} cy={c.y} rx={c.r * 1.1} ry={c.r * 0.87} fill={`url(#${after ? 'cell-after' : 'cell-before'})`} opacity={0.7 + hash(i + 4) * 0.3}/>
    <ellipse cx={c.x - c.r * 0.18} cy={c.y - c.r * 0.12} rx={c.r * 0.21} ry={c.r * 0.29} fill="#FFE4AE" opacity={0.65}/>
  </g>)}
  <path d={after ? 'M379 297C355 230 470 142 650 133C811 112 1053 172 1138 280C1203 376 1000 479 780 469C602 486 412 408 379 297Z' : 'M235 296C195 203 407 67 682 67C997 56 1286 178 1282 309C1302 453 1034 552 752 539C475 535 274 430 235 296Z'} fill="none" stroke={after ? '#A9CFDD' : '#ECA477'} strokeWidth={1.6} strokeDasharray="7 7" opacity={0.45}/>
</svg>;

// Adapted from Shotcraft BeforeAfterSliderScrub.tsx, 120f window.
// Fast 8f reveal, 36f return, >40f final hold; edge and mask use one value.
const sliderAt = (f: number) => {
  if (f < 8) return tween(f, 4, 8, 8, 6.5, E.smooth);
  if (f < 16) return tween(f, 8, 16, 6.5, 76);
  if (f < 24) return tween(f, 16, 24, 76, 70, E.smooth);
  if (f < 36) return 70;
  return tween(f, 36, 72, 70, 40, E.smooth);
};

export const Response: React.FC<SceneProps> = ({title = 'Measure tumor response.', duration = 130, style}) => {
  const f = useCurrentFrame();
  const x = sliderAt(f) / 100 * 1672;
  const speed = Math.abs(sliderAt(f + 0.5) - sliderAt(f - 0.5));
  return <SceneStage style={style}>
    <Headline size={100} end={duration - 10}>{title}</Headline>
    <div style={{position: 'absolute', left: 124, top: 310, width: 1672, height: 600, borderRadius: 24, overflow: 'hidden', boxShadow: '0 22px 85px rgba(0,8,15,0.28)', border: '1px solid rgba(177,217,235,0.2)'}}>
      <FluorescenceField/>
      <div style={{position: 'absolute', right: 36, top: 28, fontSize: 44, color: C.paper}}>Baseline</div>
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${1672 - x}px 0 0)`}}>
        <FluorescenceField after/>
        <div style={{position: 'absolute', left: 36, top: 28, fontSize: 44, color: C.paper}}>Follow-up</div>
      </div>
      <div style={{position: 'absolute', left: x - 1, top: 0, width: 2, height: 600, background: '#B9D6E2', boxShadow: '0 0 22px rgba(172,218,237,0.32)'}}/>
      <div style={{position: 'absolute', left: x - 28, top: 270, width: 56, height: 56, borderRadius: '50%', background: C.paper, color: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', scale: `${1 + Math.min(speed / 12, 1) * 0.18} 1`, boxShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>
        <svg width={28} height={18} viewBox="0 0 28 18"><path d="M9 3L3 9L9 15M19 3L25 9L19 15" stroke={C.navy} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
    <div style={{position: 'absolute', left: 126, top: 944, fontSize: 44, color: C.ice, opacity: 0.85}}>Illustrative response</div>
  </SceneStage>;
};
