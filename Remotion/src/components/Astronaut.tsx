import React, {useMemo} from 'react';
import {palette, makeToonGradient} from '../theme';

export type AstronautProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Gentle vertical bob, 0 disables. Pass the current frame. */
  frame?: number;
  bob?: number;
  /** Visor emblem faces +Z; hide it for shots seen from behind. */
  showVisor?: boolean;
};

/**
 * The series mascot — the APPROVED BRAND DIRECTION.
 * Reference: ../../Part1_WalkOnWalls/Assets/astronaut-mascot-brand-styleframe.png
 *
 * Two things define it (see that frame's notes in ../Assets/README.md):
 *
 * 1. CHANNEL IDENTITY. The helmet quotes the @AdamsVirtualSpace avatar — cream
 *    dome, thick orange-red rim, dark visor carrying a small ringed green
 *    planet.
 * 2. A FIRM SILHOUETTE. Slim waist, long legs, light plate segmentation on
 *    shoulders/thighs/shins with thin amber seams — deliberate structure
 *    without becoming armour. The mascot must stay a mascot.
 *
 * ⚠️ COLOUR CONSTRAINT: only the channel's WARM half (cream, orange-red, amber)
 * goes on the body. Teal and lime are the nearest neighbours to axis.right and
 * axis.forward — functional signal — so they stay inside the visor emblem and
 * never become large fields. The sky-blue bands are a bounded exception: small
 * rings at wrists and knees, never a running length down a limb.
 *
 * Shading is meshToonMaterial with a 2-step gradient — one hard terminator, no
 * specular. Smooth geometry, flat vector look.
 *
 * Proportions: ~7.5 heads, matching the UE5 Mannequin in the screen capture, so
 * the mograph and the live footage read as one character.
 */
export const Astronaut: React.FC<AstronautProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  frame = 0,
  bob = 0.05,
  showVisor = true,
}) => {
  const gradientMap = useMemo(() => makeToonGradient(2), []);
  const y = bob === 0 ? 0 : Math.sin(frame / 22) * bob;

  // ~7.5 heads. HEAD = helmet diameter; total height = 7.5 * HEAD = 1.8.
  const HEAD = 0.24;
  const R = HEAD / 2; // helmet radius

  // Vertical layout, ground at y = 0.
  const BOOT_TOP = 0.12;
  const LEG_TOP = 0.88;   // long legs: 0.76 vs 0.50 torso
  const WAIST_TOP = 1.0;
  const SHOULDER_Y = 1.5;
  const HELMET_Y = 1.8 - R;

  const legMid = (BOOT_TOP + LEG_TOP) / 2;
  const legLen = LEG_TOP - BOOT_TOP;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group position={[0, y, 0]}>
        {/* ── helmet ─────────────────────────────────────────────── */}
        <mesh position={[0, HELMET_Y, 0]}>
          <sphereGeometry args={[R, 32, 24]} />
          <meshToonMaterial color={palette.helmet} gradientMap={gradientMap} />
        </mesh>
        {/* thick orange-red rim ring — the channel's signature */}
        <mesh position={[0, HELMET_Y, R * 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[R * 0.72, R * 0.13, 12, 32]} />
          <meshToonMaterial color={palette.helmetRim} gradientMap={gradientMap} />
        </mesh>

        {showVisor && (
          <group position={[0, HELMET_Y, R * 0.52]}>
            <mesh>
              <sphereGeometry args={[R * 0.66, 24, 18]} />
              <meshBasicMaterial color={palette.visorGlass} toneMapped={false} />
            </mesh>
            {/* ringed planet emblem — the ONLY place teal/lime appear */}
            <mesh position={[R * 0.1, 0, R * 0.42]}>
              <sphereGeometry args={[R * 0.24, 20, 16]} />
              <meshBasicMaterial color={palette.visorPlanet} toneMapped={false} />
            </mesh>
            <mesh position={[R * 0.1, 0, R * 0.42]} rotation={[Math.PI / 2.4, 0, 0.3]}>
              <torusGeometry args={[R * 0.38, R * 0.035, 8, 28]} />
              <meshBasicMaterial color={palette.visorRing} toneMapped={false} />
            </mesh>
          </group>
        )}

        {/* neck */}
        <mesh position={[0, SHOULDER_Y + 0.05, 0]}>
          <cylinderGeometry args={[R * 0.42, R * 0.42, 0.09, 16]} />
          <meshToonMaterial color={palette.suitShadow} gradientMap={gradientMap} />
        </mesh>

        {/* ── torso: wide chest over a slim waist ────────────────── */}
        <mesh position={[0, 1.3, 0]}>
          <capsuleGeometry args={[0.2, 0.26, 8, 24]} />
          <meshToonMaterial color={palette.suit} gradientMap={gradientMap} />
        </mesh>
        <mesh position={[0, WAIST_TOP + 0.06, 0]}>
          <capsuleGeometry args={[0.145, 0.12, 8, 24]} />
          <meshToonMaterial color={palette.suit} gradientMap={gradientMap} />
        </mesh>

        {/* orange-red chest panel */}
        <mesh position={[0, 1.34, 0.185]}>
          <boxGeometry args={[0.24, 0.17, 0.05]} />
          <meshToonMaterial color={palette.panel} gradientMap={gradientMap} />
        </mesh>
        {/* shoulder straps + amber buckles */}
        {[-1, 1].map((s) => (
          <group key={`strap${s}`}>
            <mesh position={[s * 0.11, 1.42, 0.17]} rotation={[0, 0, s * 0.18]}>
              <boxGeometry args={[0.055, 0.2, 0.04]} />
              <meshToonMaterial color={palette.panel} gradientMap={gradientMap} />
            </mesh>
            <mesh position={[s * 0.13, 1.35, 0.2]}>
              <boxGeometry args={[0.05, 0.05, 0.03]} />
              <meshToonMaterial color={palette.buckle} gradientMap={gradientMap} />
            </mesh>
          </group>
        ))}
        {/* belt + amber buckle */}
        <mesh position={[0, WAIST_TOP - 0.01, 0]}>
          <cylinderGeometry args={[0.155, 0.155, 0.06, 24]} />
          <meshToonMaterial color={palette.suitShadow} gradientMap={gradientMap} />
        </mesh>
        <mesh position={[0, WAIST_TOP - 0.01, 0.15]}>
          <boxGeometry args={[0.07, 0.06, 0.03]} />
          <meshToonMaterial color={palette.buckle} gradientMap={gradientMap} />
        </mesh>

        {/* backpack */}
        <mesh position={[0, 1.32, -0.2]}>
          <capsuleGeometry args={[0.115, 0.2, 6, 18]} />
          <meshToonMaterial color={palette.suitLight} gradientMap={gradientMap} />
        </mesh>

        {/* ── arms ───────────────────────────────────────────────── */}
        {[-1, 1].map((s) => (
          <group key={`arm${s}`}>
            {/* shoulder plate */}
            <mesh position={[s * 0.235, SHOULDER_Y - 0.09, 0]}>
              <sphereGeometry args={[0.085, 20, 16]} />
              <meshToonMaterial color={palette.suitLight} gradientMap={gradientMap} />
            </mesh>
            {/* upper + fore arm */}
            <mesh position={[s * 0.26, 1.22, 0]} rotation={[0, 0, s * 0.1]}>
              <capsuleGeometry args={[0.062, 0.34, 6, 18]} />
              <meshToonMaterial color={palette.suit} gradientMap={gradientMap} />
            </mesh>
            {/* thin amber seam down the outer arm */}
            <mesh position={[s * 0.325, 1.22, 0]}>
              <boxGeometry args={[0.012, 0.3, 0.012]} />
              <meshBasicMaterial color={palette.buckle} toneMapped={false} />
            </mesh>
            {/* sky-blue wrist band (bounded accent) */}
            <mesh position={[s * 0.283, 1.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.066, 0.018, 8, 20]} />
              <meshBasicMaterial color={palette.band} toneMapped={false} />
            </mesh>
            {/* glove */}
            <mesh position={[s * 0.29, 0.95, 0]}>
              <capsuleGeometry args={[0.062, 0.06, 6, 16]} />
              <meshToonMaterial color={palette.suitDeep} gradientMap={gradientMap} />
            </mesh>
          </group>
        ))}

        {/* ── legs ───────────────────────────────────────────────── */}
        {[-1, 1].map((s) => (
          <group key={`leg${s}`}>
            <mesh position={[s * 0.095, legMid, 0]}>
              <capsuleGeometry args={[0.078, legLen - 0.156, 6, 18]} />
              <meshToonMaterial color={palette.suit} gradientMap={gradientMap} />
            </mesh>
            {/* periwinkle thigh + shin plates */}
            <mesh position={[s * 0.135, 0.72, 0.01]}>
              <capsuleGeometry args={[0.045, 0.17, 6, 14]} />
              <meshToonMaterial color={palette.suitLight} gradientMap={gradientMap} />
            </mesh>
            <mesh position={[s * 0.13, 0.34, 0.015]}>
              <capsuleGeometry args={[0.04, 0.15, 6, 14]} />
              <meshToonMaterial color={palette.suitLight} gradientMap={gradientMap} />
            </mesh>
            {/* amber shin seam */}
            <mesh position={[s * 0.095, 0.36, 0.075]}>
              <boxGeometry args={[0.012, 0.26, 0.012]} />
              <meshBasicMaterial color={palette.buckle} toneMapped={false} />
            </mesh>
            {/* sky-blue knee band */}
            <mesh position={[s * 0.095, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.082, 0.019, 8, 22]} />
              <meshBasicMaterial color={palette.band} toneMapped={false} />
            </mesh>
            {/* boot */}
            <mesh position={[s * 0.095, 0.06, 0.025]}>
              <capsuleGeometry args={[0.082, 0.05, 6, 16]} />
              <meshToonMaterial color={palette.suitDeep} gradientMap={gradientMap} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
