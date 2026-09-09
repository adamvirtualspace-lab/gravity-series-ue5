import React, {useMemo} from 'react';
import {palette, makeToonGradient} from '../theme';

export type AstronautProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Gentle vertical bob, 0 disables. Pass the current frame. */
  frame?: number;
  bob?: number;
};

/**
 * The series mascot, built from smooth primitives.
 *
 * Proportions follow Appendix A: realistic adult, ~7.5 heads — deliberately
 * matching the UE5 Mannequin so it reads as the same character as the on-screen
 * footage, NOT a chibi mascot.
 *
 * Shading is meshToonMaterial with a 2-step gradient: one hard terminator, no
 * specular, no soft falloff. Smooth geometry, flat vector look.
 *
 * Reference: ../../Part1_WalkOnWalls/Assets/astronaut-mascot-styleframe.png
 */
export const Astronaut: React.FC<AstronautProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  frame = 0,
  bob = 0.05,
}) => {
  const gradientMap = useMemo(() => makeToonGradient(2), []);
  const y = bob === 0 ? 0 : Math.sin(frame / 22) * bob;

  // ~7.5 heads: head Ø 0.24 → body ~1.8 tall.
  const HEAD = 0.24;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group position={[0, y, 0]}>
        {/* helmet */}
        <mesh position={[0, HEAD * 6.4, 0]}>
          <sphereGeometry args={[HEAD * 0.62, 32, 24]} />
          <meshToonMaterial color={palette.helmet} gradientMap={gradientMap} />
        </mesh>
        {/* visor — the hero accent, emissive for bloom */}
        <mesh position={[0, HEAD * 6.42, HEAD * 0.3]}>
          <sphereGeometry args={[HEAD * 0.48, 28, 20]} />
          <meshBasicMaterial color={palette.visor} toneMapped={false} />
        </mesh>

        {/* torso */}
        <mesh position={[0, HEAD * 4.9, 0]}>
          <capsuleGeometry args={[HEAD * 0.62, HEAD * 1.5, 8, 24]} />
          <meshToonMaterial color={palette.suit} gradientMap={gradientMap} />
        </mesh>
        {/* chest panel */}
        <mesh position={[0, HEAD * 5.2, HEAD * 0.58]}>
          <boxGeometry args={[HEAD * 0.7, HEAD * 0.5, HEAD * 0.08]} />
          <meshToonMaterial color={palette.suitLight} gradientMap={gradientMap} />
        </mesh>
        {/* backpack */}
        <mesh position={[0, HEAD * 5.1, -HEAD * 0.72]}>
          <capsuleGeometry args={[HEAD * 0.42, HEAD * 0.9, 6, 18]} />
          <meshToonMaterial color={palette.suitLight} gradientMap={gradientMap} />
        </mesh>

        {/* arms */}
        {[-1, 1].map((side) => (
          <mesh
            key={`arm${side}`}
            position={[side * HEAD * 0.92, HEAD * 4.8, 0]}
            rotation={[0, 0, side * 0.16]}
          >
            <capsuleGeometry args={[HEAD * 0.24, HEAD * 2.0, 6, 18]} />
            <meshToonMaterial color={palette.suit} gradientMap={gradientMap} />
          </mesh>
        ))}
        {/* gloves */}
        {[-1, 1].map((side) => (
          <mesh key={`glove${side}`} position={[side * HEAD * 1.24, HEAD * 3.5, 0]}>
            <sphereGeometry args={[HEAD * 0.27, 20, 16]} />
            <meshToonMaterial color={palette.suitShadow} gradientMap={gradientMap} />
          </mesh>
        ))}

        {/* legs */}
        {[-1, 1].map((side) => (
          <mesh key={`leg${side}`} position={[side * HEAD * 0.36, HEAD * 2.5, 0]}>
            <capsuleGeometry args={[HEAD * 0.28, HEAD * 2.3, 6, 18]} />
            <meshToonMaterial color={palette.suit} gradientMap={gradientMap} />
          </mesh>
        ))}
        {/* boots */}
        {[-1, 1].map((side) => (
          <mesh
            key={`boot${side}`}
            position={[side * HEAD * 0.36, HEAD * 0.9, HEAD * 0.16]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <capsuleGeometry args={[HEAD * 0.3, HEAD * 0.32, 6, 16]} />
            <meshToonMaterial color={palette.suitShadow} gradientMap={gradientMap} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
