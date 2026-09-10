import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {palette} from '../theme';

export type CaptionProps = {
  text: string;
  /** Frame within the current beat. */
  localFrame: number;
  beatDuration: number;
};

/**
 * Big, bold, high-contrast white lower-third — per Appendix A.
 * Rendered as HTML over the canvas, not in 3D, so type stays crisp.
 */
export const Caption: React.FC<CaptionProps> = ({text, localFrame, beatDuration}) => {
  const fadeIn = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    localFrame,
    [beatDuration - 12, beatDuration],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const rise = interpolate(localFrame, [0, 14], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 96,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          opacity: Math.min(fadeIn, fadeOut),
          transform: `translateY(${rise}px)`,
          color: palette.caption,
          fontFamily:
            'Inter, "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
          fontWeight: 800,
          fontSize: 58,
          letterSpacing: -0.5,
          textAlign: 'center',
          maxWidth: 1400,
          lineHeight: 1.2,
          textShadow: '0 4px 32px rgba(0,0,0,0.85)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
