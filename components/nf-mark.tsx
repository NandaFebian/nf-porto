/** Brand blue from the NF logo kit (public/nf-logo-kit.svg). */
export const brandBlue = '#4C6FFF';

/**
 * The NF mark from public/nf-mark-color.svg, inline so the N can follow the text color
 * (dark on light pages, light on dark ones) while the F arms keep the brand blue.
 * Plain paths and rects only, so it also renders inside OG images.
 */
export function NfMark({
  width = 128,
  height,
  color = 'currentColor',
  className,
}: {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 100"
      width={width}
      height={height ?? (typeof width === 'number' ? (width * 100) / 128 : undefined)}
      className={className}
      aria-hidden
    >
      <path d="M0 100V0h21l39 68.42V0h18v100H57L18 31.58V100z" fill={color} />
      <rect x="78" y="0" width="50" height="16" fill={brandBlue} />
      <rect x="78" y="40" width="34" height="16" fill={brandBlue} />
    </svg>
  );
}
