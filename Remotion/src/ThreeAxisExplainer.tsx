import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {Scene3D} from './Scene3D';
import {AxisGizmo, AxisGizmoMode} from './components/AxisGizmo';
import {Astronaut} from './components/Astronaut';
import {CameraProp} from './components/CameraProp';
import {SpaceBackdrop} from './components/SpaceBackdrop';
import {Caption} from './components/Caption';
import {beatAtFrame, palette, makeToonGradient} from './theme';

export type ThreeAxisExplainerProps = {
  mode?: AxisGizmoMode;
};

const Slab: React.FC<{gradientMap: ReturnType<typeof makeToonGradient>}> = ({gradientMap}) => (
  <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
    <boxGeometry args={[4.2, 4.2, 0.28]} />
    <meshToonMaterial color={palette.suitShadow} gradientMap={gradientMap} />
  </mesh>
);

/**
 * Flagship 30s piece — "Why Three Axes to Aim a Camera" (Appendix B).
 *
 * One persistent ThreeCanvas for the whole composition, with beat state derived
 * from the frame. Mounting a fresh canvas per beat via <Series> would rebuild
 * the WebGL context nine times and flicker.
 *
 * STATUS: beats 1–4 (the core argument) are animated. Beats 5–9 render correct
 * static states and are marked TODO — Appendix C's build order says confirm the
 * argument reads before building the rest.
 */
export const ThreeAxisExplainer: React.FC<ThreeAxisExplainerProps> = ({mode = 'flat'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = beatAtFrame(frame);
  const gradientMap = React.useMemo(() => makeToonGradient(2), []);

  const pop = (delay = 0) =>
    spring({frame: beat.localFrame - delay, fps, config: {damping: 14, mass: 0.7}});

  // Beat 8: gravity swings from -Z (floor) to -Y (wall).
  const gravityDir = React.useMemo<[number, number, number]>(() => {
    if (beat.id !== 'gravity-change') return [0, -1, 0];
    const t = interpolate(beat.localFrame, [25, 75], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const angle = t * (Math.PI / 2);
    return [0, -Math.cos(angle), -Math.sin(angle)];
  }, [beat.id, beat.localFrame]);

  const show = {
    up: true,
    right: ['yaw', 'pitch', 'nested-rig', 'chaos', 'nested-fix', 'gravity-change', 'end-card'].includes(beat.id),
    forward: ['pitch', 'nested-rig', 'chaos', 'nested-fix', 'gravity-change', 'end-card'].includes(beat.id),
  };

  const highlight =
    beat.id === 'yaw' ? ('right' as const)
    : beat.id === 'pitch' ? ('forward' as const)
    : beat.id === 'up-only' || beat.id === 'orbit' ? ('up' as const)
    : null;

  // Beat 2: the camera orbits freely — one axis cannot pin an orientation.
  const orbitAngle =
    beat.id === 'orbit'
      ? interpolate(beat.localFrame, [10, beat.duration], [0, Math.PI * 2], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const orbitRadius = 2.6;

  return (
    <AbsoluteFill style={{backgroundColor: palette.bg}}>
      <Scene3D>
        <SpaceBackdrop frame={frame} />
        <Slab gradientMap={gradientMap} />

        <Astronaut position={[-1.5, -0.2, 0]} scale={0.85} frame={frame} />

        <AxisGizmo
          mode={mode}
          gravityDir={gravityDir}
          show={show}
          highlight={highlight}
          chaos={beat.id === 'chaos'}
          frame={beat.localFrame}
          grow={{
            up: pop(0),
            right: beat.id === 'yaw' ? pop(8) : 1,
            forward: beat.id === 'pitch' ? pop(8) : 1,
          }}
          position={[0.9, 0, 0]}
        />

        {(beat.id === 'orbit' || beat.id === 'yaw' || beat.id === 'pitch') && (
          <CameraProp
            position={[
              0.9 + Math.cos(orbitAngle) * orbitRadius,
              1.0,
              Math.sin(orbitAngle) * orbitRadius,
            ]}
            scale={0.9}
          />
        )}
      </Scene3D>

      <Caption
        text={beat.caption}
        localFrame={beat.localFrame}
        beatDuration={beat.duration}
      />
    </AbsoluteFill>
  );
};
