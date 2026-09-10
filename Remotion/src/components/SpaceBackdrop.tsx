import React, {useMemo} from 'react';
import {random} from 'remotion';
import {palette} from '../theme';

export type SpaceBackdropProps = {
  count?: number;
  radius?: number;
  frame?: number;
};

const DOT_COLORS = ['#ffffff', '#38bdf8', '#e935c1', '#fcc403', '#9165f7'];

/**
 * Drifting star/dot field.
 *
 * Positions come from Remotion's deterministic `random(seed)` — NOT Math.random.
 * Frame-accurate rendering requires every frame to produce identical geometry;
 * Math.random would make the starfield jitter between frames and, worse, differ
 * between render chunks.
 */
export const SpaceBackdrop: React.FC<SpaceBackdropProps> = ({
  count = 160,
  radius = 16,
  frame = 0,
}) => {
  const dots = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const theta = random(`theta-${i}`) * Math.PI * 2;
      const phi = Math.acos(2 * random(`phi-${i}`) - 1);
      const r = radius * (0.55 + random(`r-${i}`) * 0.45);
      return {
        key: i,
        position: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ] as [number, number, number],
        size: 0.028 + random(`s-${i}`) * 0.055,
        color: DOT_COLORS[Math.floor(random(`c-${i}`) * DOT_COLORS.length)],
        drift: random(`d-${i}`),
      };
    });
  }, [count, radius]);

  return (
    <group rotation={[0, frame * 0.0006, 0]}>
      {dots.map((dot) => (
        <mesh
          key={dot.key}
          position={[
            dot.position[0],
            dot.position[1] + Math.sin(frame / 60 + dot.drift * 6.28) * 0.08,
            dot.position[2],
          ]}
        >
          <sphereGeometry args={[dot.size, 8, 8]} />
          <meshBasicMaterial color={dot.color} toneMapped={false} />
        </mesh>
      ))}

      {/* Soft radial glow behind the subject. */}
      <mesh position={[0, 0.6, -6]}>
        <circleGeometry args={[5.2, 48]} />
        <meshBasicMaterial color={palette.bgGlow} transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
};
