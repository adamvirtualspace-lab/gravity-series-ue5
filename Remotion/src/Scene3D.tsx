import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {EffectComposer, Bloom, Vignette} from '@react-three/postprocessing';
import {useVideoConfig} from 'remotion';
import {palette} from './theme';

export type Scene3DProps = {
  children: React.ReactNode;
  /** Camera position in world space. */
  cameraPosition?: [number, number, number];
  fov?: number;
};

/**
 * The shared canvas: lighting rig + post stack.
 *
 * Lighting is intentionally minimal. With meshToonMaterial + a 2-step gradient,
 * lights only decide WHICH SIDE the single hard terminator falls on — they must
 * not produce soft falloff. meshBasicMaterial parts ignore lighting entirely.
 *
 * Bloom is what turns the flat emissive trim into Kurzgesagt glow — it is doing
 * the work the flat style frames cannot show.
 */
export const Scene3D: React.FC<Scene3DProps> = ({
  children,
  cameraPosition = [0, 1.6, 7],
  fov = 42,
}) => {
  const {width, height} = useVideoConfig();

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{position: cameraPosition, fov}}
      style={{backgroundColor: palette.bg}}
      gl={{antialias: true}}
    >
      {/* Flat ambient so unlit sides never go fully black. */}
      <ambientLight intensity={1.15} />
      {/* Key — decides where the toon terminator lands. */}
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      {/* Rim, so silhouettes pop against the dark ground (Appendix A). */}
      <directionalLight position={[-5, 2, -6]} intensity={1.1} color="#8b5cf6" />

      {children}

      <EffectComposer>
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.42}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.22} darkness={0.72} />
      </EffectComposer>
    </ThreeCanvas>
  );
};
