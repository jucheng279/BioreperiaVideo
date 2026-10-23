import React, {useMemo} from 'react';
import * as THREE from 'three';
import '@react-three/fiber';

/**
 * Original illustrative geometry, informed by BioReperia's whole-larva image.
 * This is a scientific editorial illustration, not a segmented specimen or data.
 * Everything is deterministic; the parent supplies the Remotion frame.
 */

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};
const mix = THREE.MathUtils.lerp;

const tissueVertex = /* glsl */ `
  uniform float uFrame;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  varying vec3 vTint;
  void main() {
    vec3 p = position;
    vLocal = p;
    vTint = vec3(1.0);
    #ifdef USE_INSTANCING_COLOR
      vTint = instanceColor;
    #endif
    // Small slow posterior movement. No free-running clock or spring state.
    float w = smoothstep(-1.0, 6.3, p.x);
    p.y += sin(p.x * 0.72 - uFrame * 0.031) * 0.105 * w * w;
    p.z += sin(p.x * 0.52 - uFrame * 0.024) * 0.055 * w * w;
    vec4 localPosition = vec4(p, 1.0);
    vec3 localNormal = normal;
    #ifdef USE_INSTANCING
      localPosition = instanceMatrix * localPosition;
      localNormal = mat3(instanceMatrix) * localNormal;
    #endif
    vec4 mv = modelViewMatrix * localPosition;
    vNormal = normalize(normalMatrix * localNormal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const tissueFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uShell;
  uniform float uGrain;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  varying vec3 vTint;
  float h(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }
  void main() {
    vec3 n = normalize(vNormal);
    float facing = abs(dot(n, normalize(vView)));
    float rim = pow(1.0 - facing, 2.35);
    vec3 lightDirection = normalize(vec3(-0.65, 0.8, 0.75));
    float lit = 0.16 + 0.84 * max(0.0, dot(n, lightDirection));
    float specular = pow(max(0.0, dot(reflect(-lightDirection, n), normalize(vView))), 21.0);
    float grain = h(floor(vLocal * 91.0));
    float membrane = sin(vLocal.x * 32.0 + sin(vLocal.y * 21.0)) * sin(vLocal.z * 36.0 - vLocal.y * 28.0);
    vec3 col = uColor * vTint * (lit + 0.13 * rim);
    // A lightly colored membrane reflection preserves orange saturation and
    // gives a softer tissue surface than the former white frosted outline.
    col += mix(uColor, vec3(0.65), 0.14) * rim * 0.07;
    col += vec3(0.06, 0.065, 0.06) * specular;
    col += (grain - 0.5) * uGrain + membrane * uGrain * 0.25;
    float shellAlpha = mix(1.0, 0.22 + 0.78 * rim, uShell);
    float alpha = uOpacity * shellAlpha * (0.94 + 0.06 * grain);
    gl_FragColor = vec4(col, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function tissue(color: string, opacity: number, shell: number, grain = 0.03) {
  return new THREE.ShaderMaterial({
    vertexShader: tissueVertex,
    fragmentShader: tissueFragment,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uFrame: {value: 0},
      uColor: {value: new THREE.Color(color)},
      uOpacity: {value: opacity},
      uShell: {value: shell},
      uGrain: {value: grain},
    },
  });
}

function mergeGeometry(geometries: THREE.BufferGeometry[]) {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  let offset = 0;
  for (const g of geometries) {
    const p = g.getAttribute('position');
    const n = g.getAttribute('normal');
    const uv = g.getAttribute('uv');
    for (let i = 0; i < p.count; i++) {
      positions.push(p.getX(i), p.getY(i), p.getZ(i));
      normals.push(n?.getX(i) ?? 0, n?.getY(i) ?? 0, n?.getZ(i) ?? 1);
      uvs.push(uv?.getX(i) ?? 0, uv?.getY(i) ?? 0);
    }
    if (g.index) {
      for (let i = 0; i < g.index.count; i++) indices.push(g.index.getX(i) + offset);
    } else {
      for (let i = 0; i < p.count; i++) indices.push(i + offset);
    }
    offset += p.count;
    g.dispose();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

type P = [number, number, number];
function tube(points: P[], radius: number, segments = 32, radialSegments = 5) {
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    segments,
    radius,
    radialSegments,
    false,
  );
}

// x / vertical center / vertical radius / lateral radius.
const PROFILE = [
  [-5.88, 0.12, 0.012, 0.012], [-5.65, 0.18, 0.29, 0.25],
  [-5.17, 0.27, 0.57, 0.46], [-4.65, 0.32, 0.55, 0.49],
  [-4.10, 0.29, 0.45, 0.36], [-3.35, 0.26, 0.36, 0.28],
  [-2.30, 0.26, 0.29, 0.20], [-1.1, 0.23, 0.24, 0.16],
  [0, 0.20, 0.205, 0.14], [1.2, 0.17, 0.18, 0.125],
  [2.4, 0.16, 0.15, 0.105], [3.5, 0.16, 0.125, 0.084],
  [4.5, 0.17, 0.095, 0.064], [5.5, 0.20, 0.055, 0.034],
  [6.2, 0.23, 0.009, 0.006],
];

// The trunk/muscle profile above stays thin. The actual continuous outer skin
// also encloses the yolk sac and perivitelline space, then joins the trunk.
// Keeping these profiles separate prevents the yolk envelope from producing
// oversized somites or an adult-like dorsal fin.
const SKIN_PROFILE = [
  [-5.88, 0.12, 0.012, 0.012], [-5.65, 0.18, 0.29, 0.25],
  [-5.17, 0.23, 0.61, 0.50], [-4.65, -0.17, 0.99, 0.71],
  [-4.10, -0.32, 1.10, 0.82], [-3.35, -0.31, 1.04, 0.83],
  [-2.30, -0.02, 0.65, 0.60], [-1.1, 0.23, 0.24, 0.16],
  [0, 0.20, 0.205, 0.14], [1.2, 0.17, 0.18, 0.125],
  [2.4, 0.16, 0.15, 0.105], [3.5, 0.16, 0.125, 0.084],
  [4.5, 0.17, 0.095, 0.064], [5.5, 0.20, 0.055, 0.034],
  [6.2, 0.23, 0.009, 0.006],
];

function profile(x: number, rows = PROFILE) {
  let i = 0;
  while (i < rows.length - 2 && x > rows[i + 1][0]) i++;
  const a = rows[i];
  const b = rows[i + 1];
  const t = clamp((x - a[0]) / (b[0] - a[0]));
  const e = t * t * (3 - 2 * t);
  return {y: mix(a[1], b[1], e), ry: mix(a[2], b[2], e), rz: mix(a[3], b[3], e)};
}

function bodyGeometry() {
  const p: number[] = [];
  const uv: number[] = [];
  const ind: number[] = [];
  const longitudinal = 160;
  const radial = 40;
  for (let i = 0; i <= longitudinal; i++) {
    const x = mix(-5.88, 6.2, i / longitudinal);
    const f = profile(x, SKIN_PROFILE);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const uneven = 1 + 0.012 * Math.sin(x * 17 + a * 5) + 0.009 * Math.sin(x * 9 - a * 3);
      p.push(x, f.y + Math.cos(a) * f.ry * uneven, Math.sin(a) * f.rz * uneven);
      uv.push(i / longitudinal, j / radial);
      if (i < longitudinal && j < radial) {
        const k = i * (radial + 1) + j;
        ind.push(k, k + radial + 1, k + 1, k + 1, k + radial + 1, k + radial + 2);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(ind);
  geometry.computeVertexNormals();
  return geometry;
}

function finEdge(x: number, top: boolean) {
  const f = profile(x);
  const s = clamp((x + 3.1) / 9.45);
  const fullness = Math.sin(Math.PI * s) ** 0.65;
  return f.y + (top ? 1 : -1) * (f.ry * 0.9 + 0.40 * fullness);
}

function finGeometry(top: boolean) {
  const p: number[] = [];
  const uv: number[] = [];
  const ind: number[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = mix(-3.05, 6.19, i / 100);
    const f = profile(x);
    p.push(x, f.y + f.ry * (top ? 0.65 : -0.65), 0);
    p.push(x, finEdge(x, top), 0.018 * Math.sin(x * 2.2));
    uv.push(i / 100, 0, i / 100, 1);
    if (i < 100) {
      const a = i * 2;
      ind.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(ind);
  g.computeVertexNormals();
  return g;
}

function anatomyGeometry(detail: boolean) {
  const somites: THREE.BufferGeometry[] = [];
  const vessels: THREE.BufferGeometry[] = [];
  const outlines: THREE.BufferGeometry[] = [];
  const count = detail ? 29 : 18;
  for (let i = 0; i < count; i++) {
    const x = mix(-2.8, 5.65, i / (count - 1));
    const f = profile(x);
    for (const side of [-1, 1]) {
      const z = side * (f.rz * 0.91);
      somites.push(tube([
        [x - 0.12, f.y + f.ry * 0.82, z * 0.54],
        [x + 0.12, f.y, z],
        [x - 0.11, f.y - f.ry * 0.78, z * 0.52],
      ], detail ? 0.012 : 0.015, 8, 4));
    }
    if (detail && i % 2 === 0 && i < 25) {
      vessels.push(tube([
        [x - 0.03, f.y - f.ry * 0.36, f.rz * 0.4],
        [x + 0.08, f.y + f.ry * 0.2, f.rz * 0.3],
        [x + 0.20, f.y + f.ry * 0.65, 0],
      ], 0.009, 8, 4));
    }
  }
  for (const top of [false, true]) {
    const points: P[] = Array.from({length: 45}, (_, i) => {
      const x = mix(-3.05, 6.19, i / 44);
      return [x, finEdge(x, top), 0.018 * Math.sin(x * 2.2)];
    });
    outlines.push(tube(points, 0.009, 80, 4));
  }
  vessels.push(tube([[-4.4, -0.21, 0.18], [-3.6, -0.03, 0.24], [-2.3, 0.14, 0.13], [0, 0.10, 0.06], [3, 0.08, 0.03], [5.8, 0.19, 0]], 0.018, 80, 5));
  vessels.push(tube([[-4.4, 0.48, 0.05], [-3.2, 0.40, 0], [-1, 0.36, 0], [2.5, 0.26, 0], [5.7, 0.25, 0]], 0.014, 75, 5));
  return {somites: mergeGeometry(somites), vessels: mergeGeometry(vessels), outlines: mergeGeometry(outlines)};
}

function organicSphere(detail = true, roughness = 1) {
  const g = new THREE.SphereGeometry(1, detail ? 36 : 20, detail ? 24 : 14);
  const p = g.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const relief = 0.045 * Math.sin(x * 8 + z * 4) * Math.sin(y * 9 - z * 5)
      + 0.023 * Math.sin(x * 21 + y * 16) * Math.sin(z * 18 - y * 7)
      + 0.04 * Math.sin(x * 3.3 + y * 4.6 + z * 1.8);
    const r = 1 + relief * roughness;
    p.setXYZ(i, x * r, y * r, z * r);
  }
  p.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

export type TumorClusterProps = {
  frame?: number;
  scale?: number;
  opacity?: number;
  seed?: number;
  cellCount?: number;
  color?: string;
  detail?: boolean;
};

/** Base cluster is about 2.3 units across. Three draw calls, regardless of count. */
export const TumorCluster: React.FC<TumorClusterProps> = ({
  frame = 0, scale = 1, opacity = 1, seed = 7, cellCount = 38,
  color = '#E8642C', detail = true,
}) => {
  const built = useMemo(() => {
    const cellGeometry = organicSphere(detail, 0.72);
    const nuclearGeometry = organicSphere(false, 0.55);
    const membraneMaterial = tissue(color, 0.79, 0.55, 0.012);
    membraneMaterial.side = THREE.FrontSide;
    const nucleusMaterial = new THREE.MeshStandardMaterial({
      color: '#642d24', roughness: 0.52, metalness: 0.02,
      emissive: '#9b3518', emissiveIntensity: 0.10,
      transparent: true, opacity: 0.96, depthWrite: true,
    });
    const nucleolusMaterial = new THREE.MeshStandardMaterial({
      color: '#e99a57', roughness: 0.45, emissive: '#f87e39', emissiveIntensity: 0.20,
      transparent: true, opacity: 0.48, depthWrite: false,
    });
    const membranes = new THREE.InstancedMesh(cellGeometry, membraneMaterial, cellCount);
    const nuclei = new THREE.InstancedMesh(nuclearGeometry, nucleusMaterial, cellCount);
    const nucleoli = new THREE.InstancedMesh(nuclearGeometry, nucleolusMaterial, cellCount);
    membranes.renderOrder = 5;
    nuclei.renderOrder = 3;
    nucleoli.renderOrder = 4;
    membranes.frustumCulled = nuclei.frustumCulled = nucleoli.frustumCulled = false;
    const cells = Array.from({length: cellCount}, (_, i) => {
      const golden = i * 2.399963229728653;
      const latitude = Math.acos(1 - 2 * (i + 0.5) / cellCount);
      const r = i < 6 ? 0.30 + 0.1 * hash(i + seed) : 0.76 + hash(i * 3 + seed) * 0.16;
      const size = 0.235 + hash(i * 5 + seed) * 0.095;
      return {
        x: Math.cos(golden) * Math.sin(latitude) * r,
        y: Math.sin(golden) * Math.sin(latitude) * r * 0.82,
        z: Math.cos(latitude) * r * 0.82,
        size,
        spin: hash(i + seed * 3) * Math.PI,
        aspect: 0.88 + hash(i * 8 + seed) * 0.28,
      };
    });
    const tint = new THREE.Color();
    for (let i = 0; i < cellCount; i++) {
      tint.setRGB(0.93 + hash(i + seed) * 0.07, 0.84 + hash(i * 2 + seed) * 0.16, 0.75 + hash(i * 4 + seed) * 0.25);
      membranes.setColorAt(i, tint);
    }
    return {membranes, nuclei, nucleoli, cells, membraneMaterial, nucleusMaterial, nucleolusMaterial};
  }, [cellCount, color, detail, seed]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  built.membraneMaterial.uniforms.uOpacity.value = clamp(opacity) * 0.79;
  built.membraneMaterial.uniforms.uFrame.value = 0; // Macro cells do not inherit the larval tail bend.
  built.nucleusMaterial.opacity = clamp(opacity) * 0.96;
  built.nucleolusMaterial.opacity = clamp(opacity) * 0.48;
  for (let i = 0; i < built.cells.length; i++) {
    const c = built.cells[i];
    const breath = 1 + 0.018 * Math.sin(frame * 0.026 + i * 1.37);
    dummy.position.set(c.x, c.y, c.z);
    dummy.rotation.set(c.spin, c.spin * 0.7, c.spin * 0.2);
    dummy.scale.set(c.size * breath, c.size * c.aspect / breath, c.size * 0.94);
    dummy.updateMatrix();
    built.membranes.setMatrixAt(i, dummy.matrix);
    dummy.position.set(c.x + c.size * 0.08, c.y - c.size * 0.04, c.z);
    dummy.scale.multiplyScalar(0.49);
    dummy.updateMatrix();
    built.nuclei.setMatrixAt(i, dummy.matrix);
    dummy.position.x -= c.size * 0.07;
    dummy.position.y += c.size * 0.07;
    dummy.position.z += c.size * 0.12;
    dummy.scale.multiplyScalar(0.28);
    dummy.updateMatrix();
    built.nucleoli.setMatrixAt(i, dummy.matrix);
  }
  built.membranes.instanceMatrix.needsUpdate = true;
  built.nuclei.instanceMatrix.needsUpdate = true;
  built.nucleoli.instanceMatrix.needsUpdate = true;
  return <group scale={scale}>
    <primitive object={built.nuclei}/>
    <primitive object={built.nucleoli}/>
    <primitive object={built.membranes}/>
  </group>;
};

export type ZebrafishProps = {
  frame: number;
  tumorScale?: number;
  opacity?: number;
  detail?: boolean;
};

export const TUMOR_ANCHOR: P = [-2.78, -0.26, 0.32];

export const Zebrafish: React.FC<ZebrafishProps> = ({frame, tumorScale = 1, opacity = 1, detail = true}) => {
  const model = useMemo(() => {
    const skin = tissue('#94c6d5', 0.72, 0.48, 0.006);
    const fin = tissue('#a6d8dc', 0.16, 0.10, 0.005);
    const edge = tissue('#add7dd', 0.13, 0, 0.004);
    const muscle = tissue('#87aebd', 0.08, 0.08, 0.004);
    const vessels = tissue('#66b4be', 0.12, 0, 0.005);
    const chord = tissue('#bfd3c8', 0.16, 0.2, 0.005);
    const yolk = tissue('#b5c4b5', 0.80, 0.35, 0.009);
    const brain = tissue('#77abbc', 0.18, 0.50, 0.005);
    const anatomy = anatomyGeometry(detail);
    const chordGeo = tube([[-4.1, 0.30, 0], [-3, 0.28, 0], [-1, 0.24, 0], [2, 0.18, 0], [4.2, 0.18, 0], [6.10, 0.23, 0]], 0.032, 100, 7);
    const mouthGeo = tube([[-5.73, -0.005, 0.08], [-5.65, -0.05, 0.21], [-5.48, -0.08, 0.28]], 0.013, 12, 5);
    const yolkGeo = organicSphere(detail, 0.20);
    const smallGeo = new THREE.SphereGeometry(1, 12, 9);
    const grainMaterial = new THREE.MeshStandardMaterial({color: '#96afa3', transparent: true, opacity: 0.09, roughness: 0.67, depthWrite: false});
    const granules = new THREE.InstancedMesh(smallGeo, grainMaterial, detail ? 86 : 32);
    const d = new THREE.Object3D();
    for (let i = 0; i < granules.count; i++) {
      const theta = hash(i * 5 + 3) * Math.PI * 2;
      const phi = Math.acos(2 * hash(i * 7 + 5) - 1);
      const r = Math.cbrt(hash(i * 3 + 9)) * 0.86;
      d.position.set(-3.70 + Math.cos(theta) * Math.sin(phi) * r * 1.04,
        -0.50 + Math.sin(theta) * Math.sin(phi) * r * 0.77,
        Math.cos(phi) * r * 0.58);
      const size = 0.025 + hash(i * 9 + 7) * 0.055;
      d.scale.set(size, size * 0.8, size);
      d.updateMatrix();
      granules.setMatrixAt(i, d.matrix);
    }
    granules.renderOrder = 1;
    return {skin, fin, edge, muscle, vessels, chord, yolk, brain, anatomy, chordGeo, mouthGeo, yolkGeo,
      body: bodyGeometry(), upperFin: finGeometry(true), lowerFin: finGeometry(false), granules, grainMaterial};
  }, [detail]);
  const matScale: [THREE.ShaderMaterial, number][] = [
    [model.skin, 0.72], [model.fin, 0.16], [model.edge, 0.13], [model.muscle, 0.08],
    [model.vessels, 0.12], [model.chord, 0.16], [model.yolk, 0.80], [model.brain, 0.18],
  ];
  for (const [mat, baseOpacity] of matScale) {
    mat.uniforms.uFrame.value = frame;
    mat.uniforms.uOpacity.value = baseOpacity * clamp(opacity);
  }
  model.grainMaterial.opacity = 0.09 * clamp(opacity);
  return <group>
    <mesh geometry={model.upperFin} material={model.fin} renderOrder={0}/>
    <mesh geometry={model.lowerFin} material={model.fin} renderOrder={0}/>
    <mesh geometry={model.anatomy.outlines} material={model.edge} renderOrder={1}/>
    <mesh geometry={model.anatomy.somites} material={model.muscle} renderOrder={1}/>
    <mesh geometry={model.chordGeo} material={model.chord} renderOrder={1}/>
    <mesh geometry={model.anatomy.vessels} material={model.vessels} renderOrder={2}/>
    <primitive object={model.granules}/>
    <mesh position={[-3.70, -0.50, 0]} scale={[1.09, 0.81, 0.62]} geometry={model.yolkGeo} material={model.yolk} renderOrder={3}/>
    <mesh position={[-4.62, 0.42, 0]} scale={[0.57, 0.25, 0.26]} material={model.brain} renderOrder={2}>
      <sphereGeometry args={[1, 28, 18]}/>
    </mesh>
    <mesh position={[-4.13, 0.29, 0]} scale={[0.34, 0.18, 0.18]} material={model.brain} renderOrder={2}>
      <sphereGeometry args={[1, 24, 16]}/>
    </mesh>
    {/* The eye is heavily pigmented in an otherwise transparent early larva. */}
    <mesh position={[-5.11, 0.25, -0.40]} scale={[0.33, 0.35, 0.15]}>
      <sphereGeometry args={[1, 32, 24]}/>
      <meshStandardMaterial color="#10262d" roughness={0.16} metalness={0.25} transparent opacity={opacity}/>
    </mesh>
    {/* The same continuous skin encloses head, yolk and implant; rendering its
        transparent front surface after the stain makes the implant internal. */}
    <mesh geometry={model.body} material={model.skin} renderOrder={7}/>
    <mesh position={[-5.11, 0.25, 0.42]} scale={[0.345, 0.36, 0.16]} renderOrder={5}>
      <sphereGeometry args={[1, 40, 28]}/>
      <meshPhysicalMaterial color="#07171e" roughness={0.12} metalness={0.20} clearcoat={1} clearcoatRoughness={0.09} transparent opacity={opacity}/>
    </mesh>
    <mesh position={[-5.11, 0.25, 0.551]} scale={[0.91, 1, 1]} renderOrder={6}>
      <torusGeometry args={[0.281, 0.017, 9, 44]}/>
      <meshStandardMaterial color="#527880" roughness={0.3} metalness={0.5} transparent opacity={opacity * 0.34}/>
    </mesh>
    <mesh geometry={model.mouthGeo} material={model.muscle} renderOrder={5}/>
    <group position={TUMOR_ANCHOR} rotation={[0.1, 0.2, -0.12]}>
      <TumorCluster frame={frame} scale={0.32 * tumorScale} opacity={opacity} detail={detail} cellCount={detail ? 38 : 24}/>
    </group>
  </group>;
};
