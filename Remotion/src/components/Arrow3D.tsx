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
  opacity?: number;
};

/**
 * A smooth arrow: capsule-ish cylinder shaft + cone head.
 *
 * Deliberately NOT flat-shaded — see Appendix A. Uses meshBasicMaterial so the
 * colour reads as a pure flat vector fill with no lighting falloff at all, which
 * is what makes the axis colours read as signal. `toneMapped={false}` keeps the
 * colour above the bloom threshold, so the glow comes from the post pass rather
 * than from any extra geometry.
 *
 * NOTE: every mesh here must honour `opacity`. An earlier version carried a
 * separate always-opaque "glow core" cylinder inside the shaft; when AxisGizmo
 * dimmed a non-highlighted axis, the shell faded but that core did not, so the
 * shaft stayed bright white while the head went grey.
 */
export const Arrow3D: React.FC<Arrow3DProps> = ({
  direction,
  color,
  length = 2,
  radius = 0.055,
  grow = 1,
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
    </group>
  );
};
