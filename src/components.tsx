import React, {useLayoutEffect} from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {C, hash, tween} from './design';

export type SceneProps = {
  title?: string;
  duration?: number;
  accentColor?: string;
  style?: React.CSSProperties;
};

export const SceneStage: React.FC<{
  children: React.ReactNode; light?: boolean; first?: boolean; style?: React.CSSProperties;
}> = ({children, light = false, first = false, style}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{
    fontFamily: 'Poppins, sans-serif', color: light ? C.navy : C.paper, overflow: 'hidden',
    background: light ? C.paper : C.ink,
    opacity: first ? 1 : tween(frame, 0, 10),
    ...style,
  }}>
    <AbsoluteFill style={{background: light
      ? 'radial-gradient(ellipse at 75% 45%, #FFFFFF 0%, #FFFDFA 55%, #ECEBE6 100%)'
      : 'radial-gradient(ellipse at 70% 46%, #0B3E59 0%, #052B40 31%, #031B2B 64%, #02131F 100%)'}} />
    {!light && <AbsoluteFill style={{opacity: 0.22, background: 'linear-gradient(140deg, transparent 33%, rgba(138,203,226,0.08) 50%, transparent 65%)'}} />}
    {children}
    <AbsoluteFill style={{pointerEvents: 'none', boxShadow: light ? 'inset 0 0 150px rgba(7,68,112,0.035)' : 'inset 0 0 220px rgba(0,10,18,0.22)'}} />
  </AbsoluteFill>;
};

export const Headline: React.FC<{
  children: React.ReactNode; x?: number; y?: number; width?: number; size?: number; color?: string; end?: number; delay?: number; center?: boolean;
}> = ({children, x = 124, y = 110, width = 1640, size = 100, color, end = 120, delay = 7, center = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <Interactive.Div name="Headline" premountFor={fps} style={{
    position: 'absolute', left: x, top: y, width, color,
    fontSize: size, fontWeight: 500, lineHeight: 1.14, letterSpacing: '-0.045em',
    whiteSpace: 'pre-line', textAlign: center ? 'center' : 'left',
    opacity: interpolate(frame, [delay, delay + 12, end - 8, end], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    translate: interpolate(frame, [delay, delay + 22], ['0px 34px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
  }}>{children}</Interactive.Div>;
};

export const Caption: React.FC<{children: React.ReactNode; x?: number; y?: number; color?: string; size?: number; opacity?: number; width?: number; center?: boolean}> = ({children, x = 124, y = 930, color, size = 36, opacity = 1, width, center}) => <div style={{position: 'absolute', left: x, top: y, width, fontSize: size, fontWeight: 400, lineHeight: 1.3, letterSpacing: '-0.015em', color, opacity, textAlign: center ? 'center' : 'left'}}>{children}</div>;

export const CameraRig: React.FC<{position?: [number, number, number]; target?: [number, number, number]; fov?: number}> = ({position = [0, 0, 18], target = [0, 0, 0], fov = 35}) => {
  const {camera, invalidate} = useThree();
  useLayoutEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...target);
    if ('fov' in camera) camera.fov = fov;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, position[0], position[1], position[2], target[0], target[1], target[2], fov]);
  return null;
};

export const ScienceCanvas: React.FC<{
  children: React.ReactNode; light?: boolean; style?: React.CSSProperties; width?: number; height?: number;
}> = ({children, light, style, width, height}) => {
  const config = useVideoConfig();
  return <ThreeCanvas width={width ?? config.width} height={height ?? config.height}
    camera={{position: [0, 0, 18], fov: 35, near: 0.1, far: 100}}
    gl={{antialias: true, alpha: true, powerPreference: 'high-performance'}}
    style={{position: 'absolute', inset: 0, ...style}}>
    <ambientLight intensity={light ? 1.5 : 1.1} color="#E7F4F7" />
    <directionalLight position={[-6, 7, 8]} intensity={3.4} color="#DDF5FF" />
    <directionalLight position={[7, -2, 3]} intensity={2.1} color="#82C7E2" />
    <directionalLight position={[1, 4, -5]} intensity={2.5} color="#A3DCEC" />
    <pointLight position={[4, 1, 5]} intensity={36} color="#F5A975" distance={18} decay={2} />
    {children}
  </ThreeCanvas>;
};

export const Dust: React.FC<{frame?: number; amount?: number; light?: boolean; opacity?: number}> = ({frame = 0, amount = 26, light = false, opacity = 1}) => <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
  {Array.from({length: amount}, (_, i) => {
    const depth = 0.35 + hash(i + 7) * 1.05;
    const x = hash(i + 64) * 2200 - 130 - frame * 0.3 * depth;
    const y = hash(i + 18) * 1080 + Math.sin(frame * 0.007 + i) * 8;
    const radius = hash(i + 39) > 0.87 ? 10 + hash(i) * 18 : 1 + hash(i) * 3;
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: radius * 2, height: radius * 2, borderRadius: '50%', background: light ? '#5085B5' : '#CBEAF3', opacity: (radius > 8 ? 0.035 : 0.12) * depth, filter: radius > 8 ? 'blur(7px)' : undefined}} />;
  })}
</AbsoluteFill>;

export const CornerMarks: React.FC<{x: number; y: number; w: number; h: number; color?: string; opacity?: number}> = ({x, y, w, h, color = C.orange, opacity = 1}) => <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity}}>
  <path d={`M${x + 24} ${y}H${x}V${y + 24} M${x + w - 24} ${y}H${x + w}V${y + 24} M${x} ${y + h - 24}V${y + h}H${x + 24} M${x + w - 24} ${y + h}H${x + w}V${y + h - 24}`}
    fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
</svg>;
