import React, {useMemo} from 'react';
import {palette, makeToonGradient} from '../theme';

export type CameraPropProps = {
  position?: [number, number, number];
  /** Where the camera body should aim. */
  lookAt?: [number, number, number];
  scale?: number;
};

/**
 * The little camera object that orbits the up-axis in beats 2–4, standing in for
 * the player camera. Smooth primitives, flat toon fill.
 */
export const CameraProp: React.FC<CameraPropProps> = ({
  position = [0, 0, 0],
  scale = 1,
}) => {
  const gradientMap = useMemo(() => makeToonGradient(2), []);

  return (
    <group position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[0.42, 0.3, 0.3]} />
        <meshToonMaterial color={palette.helmet} gradientMap={gradientMap} />
      </mesh>
      {/* lens */}
      <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.18, 24]} />
        <meshToonMaterial color={palette.suitShadow} gradientMap={gradientMap} />
      </mesh>
      {/* glowing lens element */}
      <mesh position={[0, 0, 0.31]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 20]} />
        <meshBasicMaterial color={palette.hose} toneMapped={false} />
      </mesh>
    </group>
  );
};
