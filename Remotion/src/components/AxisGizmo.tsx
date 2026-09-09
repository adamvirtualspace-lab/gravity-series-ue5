import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Arrow3D} from './Arrow3D';
import {axis} from '../theme';

export type AxisGizmoMode = 'flat' | 'sphere' | 'multi';

export type AxisGizmoProps = {
  /** Part 1 wall · Part 2 planet · Part 3 many. Series-wide reuse knob. */
  mode: AxisGizmoMode;
  /** Gravity direction, e.g. [0,0,-1] → [0,-1,0]. */
  gravityDir: [number, number, number];
  show: {up?: boolean; right?: boolean; forward?: boolean};
  highlight?: 'up' | 'right' | 'forward' | null;
  /** Beat 6 — one pivot doing all three rotations. */
  chaos?: boolean;
  /** 0–1 grow-in per axis. */
  grow?: {up?: number; right?: number; forward?: number};
  /** Drives the chaos wobble; pass the current frame. */
  frame?: number;
  position?: [number, number, number];
};

/**
 * THE reusable heart of the series. Parts 1–3 differ by props, not by rewrite.
 *
 * Builds an orthonormal basis from the gravity direction — the same idea as
 * Unreal's "Make Rotation From Axes", which is the trick the whole tutorial
 * turns on: up comes from gravity, and forward/right are rebuilt to match.
 */
export const AxisGizmo: React.FC<AxisGizmoProps> = ({
  gravityDir,
  show,
  highlight = null,
  chaos = false,
  grow,
  frame = 0,
  position = [0, 0, 0],
}) => {
  const basis = useMemo(() => {
    const up = new THREE.Vector3(...gravityDir).multiplyScalar(-1).normalize();

    // Pick a reference axis that is not parallel to `up`, so the cross products
    // stay well-conditioned as gravity swings around.
    const ref =
      Math.abs(up.z) < 0.9
        ? new THREE.Vector3(0, 0, 1)
        : new THREE.Vector3(1, 0, 0);

    const right = new THREE.Vector3().crossVectors(ref, up).normalize();
    const forward = new THREE.Vector3().crossVectors(up, right).normalize();

    return {
      up: up.toArray() as [number, number, number],
      right: right.toArray() as [number, number, number],
      forward: forward.toArray() as [number, number, number],
    };
  }, [gravityDir]);

  // Beat 6: everything on one pivot, so the rotations compound into a tumble.
  const chaosRotation = useMemo<[number, number, number]>(() => {
    if (!chaos) return [0, 0, 0];
    const t = frame / 30;
    return [t * 1.7, t * 2.3, t * 1.1];
  }, [chaos, frame]);

  const dim = (which: 'up' | 'right' | 'forward') =>
    highlight === null || highlight === which ? 1 : 0.22;

  return (
    <group position={position} rotation={chaosRotation}>
      {show.up !== false && (
        <Arrow3D
          direction={basis.up}
          color={axis.up}
          grow={grow?.up ?? 1}
          opacity={dim('up')}
        />
      )}
      {show.right && (
        <Arrow3D
          direction={basis.right}
          color={axis.right}
          grow={grow?.right ?? 1}
          opacity={dim('right')}
        />
      )}
      {show.forward && (
        <Arrow3D
          direction={basis.forward}
          color={axis.forward}
          grow={grow?.forward ?? 1}
          opacity={dim('forward')}
        />
      )}
    </group>
  );
};
