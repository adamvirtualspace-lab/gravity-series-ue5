import * as THREE from 'three';

/**
 * Palette, timing and material tokens for the UE5 Gravity Series mograph.
 *
 * Art direction: Appendix A of
 * ../../Part1_WalkOnWalls/Scripts/Custom-Gravity-Part1-Script.md
 *
 * Smooth 3D geometry, FLAT vector-look shading. No specular, no PBR falloff.
 */

// ---------------------------------------------------------------- render ----

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_IN_FRAMES = 900; // 30s

// --------------------------------------------------------------- palette ----

/**
 * Measured from Part1_WalkOnWalls/Assets/astronaut-mascot-styleframe.png
 * (octree-quantised) — these are sampled values, not prompted ones.
 */
export const palette = {
  /**
   * OPEN DECISION: the style frame came out near-black, Appendix A specifies
   * navy (#0b0d2a). Near-black gives the violet more separation. Swap to
   * `bgNavy` if the appendix wins.
   */
  bg: '#00000e',
  bgNavy: '#0b0d2a',
  bgGlow: '#171a4a',

  suit: '#5b1dd9',
  suitLight: '#9165f7',
  suitShadow: '#3611a1',
  suitDeep: '#1d0961',
  helmet: '#dfd5f9',
  visor: '#fca602',
  strap: '#f55504',
  buckle: '#fcc403',
  hose: '#32b1f9',

  caption: '#ffffff',
} as const;

/**
 * Axis colours are FUNCTIONAL SIGNAL, not decoration — the viewer reads meaning
 * off them. Keep the mascot from competing with these.
 *
 * OPEN DECISION: the violet suit sits next to `gravity` magenta on the wheel.
 * Verify in the first animated test that the gravity arrow still reads.
 */
export const axis = {
  up: '#ffffff',      // UP / gravity axis
  right: '#38bdf8',   // yaw — left/right
  forward: '#4ade80', // pitch — up/down
  gravity: '#e935c1', // the gravity vector itself
} as const;

// -------------------------------------------------------------- materials ----

/**
 * A 2-step toon gradient map. This is what makes smooth geometry read as FLAT
 * vector art: lighting collapses to one hard terminator instead of a soft
 * gradient, matching the hard-edged shadow shapes in the style frame.
 *
 * Use with <meshToonMaterial gradientMap={...} />. For pure unlit fill (no
 * shading at all) use <meshBasicMaterial /> instead.
 */
export const makeToonGradient = (steps = 2): THREE.DataTexture => {
  const data = new Uint8Array(steps);
  for (let i = 0; i < steps; i++) {
    data[i] = Math.round((255 * (i + 1)) / steps);
  }
  const tex = new THREE.DataTexture(data, steps, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
};

// ------------------------------------------------------------------ beats ----

export type BeatId =
  | 'up-only' | 'orbit' | 'yaw' | 'pitch' | 'nested-rig'
  | 'chaos' | 'nested-fix' | 'gravity-change' | 'end-card';

export type Beat = {
  id: BeatId;
  /** frames */
  duration: number;
  caption: string;
};

/** Appendix B beat sheet. Durations sum to DURATION_IN_FRAMES. */
export const BEATS: Beat[] = [
  {id: 'up-only',        duration: 90,  caption: '"Up" tells you which way is up…'},
  {id: 'orbit',          duration: 110, caption: '…but you can still spin. One axis can’t aim a camera.'},
  {id: 'yaw',            duration: 90,  caption: 'A 2nd axis locks left/right — yaw.'},
  {id: 'pitch',          duration: 110, caption: 'A 3rd gives up/down — pitch. 3 axes = 1 orientation.'},
  {id: 'nested-rig',     duration: 100, caption: '1 pivot · 1 axis · 1 job'},
  {id: 'chaos',          duration: 90,  caption: 'One pivot doing all three = chaos.'},
  {id: 'nested-fix',     duration: 100, caption: 'Nest them → clean space.'},
  {id: 'gravity-change', duration: 120, caption: 'Change gravity → rebuild from 3 axes.'},
  {id: 'end-card',       duration: 90,  caption: '3 pivots. 3 jobs. That’s the whole trick.'},
];

export type BeatWindow = Beat & {start: number; end: number; localFrame: number};

/** Resolve which beat a global frame falls in, plus its frame within that beat. */
export const beatAtFrame = (frame: number): BeatWindow => {
  let start = 0;
  for (const beat of BEATS) {
    const end = start + beat.duration;
    if (frame < end) {
      return {...beat, start, end, localFrame: frame - start};
    }
    start = end;
  }
  const last = BEATS[BEATS.length - 1];
  return {
    ...last,
    start: DURATION_IN_FRAMES - last.duration,
    end: DURATION_IN_FRAMES,
    localFrame: last.duration,
  };
};
