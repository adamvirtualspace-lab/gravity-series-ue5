import React from 'react';
import {Composition} from 'remotion';
import {ThreeAxisExplainer} from './ThreeAxisExplainer';
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from './theme';

/**
 * Parts 2 and 3 reuse this same composition with a different `mode` prop —
 * flat wall → sphere → multi-planet is a prop change, not a rewrite.
 * Register them here once their beats are timed.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ThreeAxisExplainer"
        component={ThreeAxisExplainer}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{mode: 'flat' as const}}
      />
    </>
  );
};
