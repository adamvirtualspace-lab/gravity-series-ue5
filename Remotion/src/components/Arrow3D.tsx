import React, {useMemo} from 'react';
import * as THREE from 'three';

export type Arrow3DProps = {
  /** Direction the arrow points. Does not need to be normalised. */
  direction: [number, number, number];
  color: string;
  /** Total length, shaft + head. */
  length?: number;
  radius?: number;
  /** 0–1, drives a grow-in animation by scaling along the arrow's axis. */
  grow?: number;
  /** Emissive strength — what UnrealBloom picks up. */
  glow?: number;
  opacity?: number;
};

/**
 * A smooth arrow: capsule-ish cylinder shaft + cone head.
 *
 * Deliberately NOT flat-shaded — see Appendix A. Uses meshBasicMaterial so the
 * colour reads as a pure flat vector fill with no lighting falloff at all, which
 * is what makes the axis colours read as signal.
 */
export const Arrow3D: React.FC<Arrow3DProps> = ({
  direction,
  color,
  length = 2,
  radius = 0.055,
  grow = 1,
  glow = 1.6,
  opacity = 1,
}) => {
  const quaternion = useMemo(() => {
    const dir = new THREE.Vector3(...direction).normalize();
    // Geometry is authored pointing +Y; rotate that onto `direction`.
    return new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir,
    );
  }, [direction]);

  const g = Math.max(0.0001, grow);
  const headLength = length * 0.26;
  const shaftLength = length - headLength;

  return (
    <group quaternion={quaternion} scale={[1, g, 1]}>
      <mesh position={[0, shaftLength / 2, 0]}>
        <cylinderGeometry args={[radius, radius, shaftLength, 20]} />
        <meshBasicMaterial
          color={color}
          transparent={opacity < 1}
          opacity={opacity}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, shaftLength + headLength / 2, 0]}>
        <coneGeometry args={[radius * 2.6, headLength, 24]} />
        <meshBasicMaterial
          color={color}
          transparent={opacity < 1}
          opacity={opacity}
          toneMapped={false}
        />
      </mesh>

      {/* Emissive core the bloom pass latches onto. */}
      <mesh position={[0, shaftLength / 2, 0]} scale={glow > 0 ? 1 : 0}>
        <cylinderGeometry args={[radius * 0.5, radius * 0.5, shaftLength, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
};
