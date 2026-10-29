import type { CSSProperties } from 'react';

/** Brand navy from the NF logo kit (public/nf-logo-kit.svg), for light backgrounds. */
export const brandNavy = '#000080';
/** Navy is 1.17:1 on the dark ink, so dark backgrounds use this lighter step of the same hue (5.76:1). */
export const brandNavyOnDark = '#8080FF';

/**
 * The NF mark from public/nf-mark-color.svg, inline so it follows the theme: the N takes the text
 * color and the F arms take `--brand` (navy on light pages, the lighter navy on dark ones).
 * Plain paths and rects only, so it also renders inside OG images, where both colors are passed in.
 */
export function NfMark({
  width = 128,
  height,
  color = 'currentColor',
  armColor = 'var(--brand)',
  animated = false,
  className,
}: {
  width?: number | string;
  height?: number | string;
  color?: string;
  armColor?: string;
  /** Grow the F arms out of the N on load (see `.nf-mark-animated` in app/global.css). */
  animated?: boolean;
  className?: string;
}) {
  const arm = (index: number) => (animated ? { className: 'nf-arm', style: { '--arm': index } as CSSProperties } : {});
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 100"
      width={width}
      height={height ?? (typeof width === 'number' ? (width * 100) / 128 : undefined)}
      className={animated ? `nf-mark-animated ${className ?? ''}`.trim() : className}
      aria-hidden
    >
      <path d="M0 100V0h21l39 68.42V0h18v100H57L18 31.58V100z" fill={color} />
      <rect x="78" y="0" width="50" height="16" fill={armColor} {...arm(0)} />
      <rect x="78" y="40" width="34" height="16" fill={armColor} {...arm(1)} />
    </svg>
  );
}
