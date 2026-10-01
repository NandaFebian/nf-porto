'use client';

import { useRef, type PointerEvent } from 'react';
import { cn } from '@/lib/cn';

/**
 * The hero name with a brick-colored copy revealed in a circle around the pointer.
 * The copy is aria-hidden and ignores pointer events, so selection and screen readers see one name.
 */
export function SpotlightName({ name, className }: { name: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const frame = useRef(0);

  const move = (event: PointerEvent<HTMLHeadingElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty('--spot-x', `${x}px`);
      element.style.setProperty('--spot-y', `${y}px`);
      element.dataset.spot = 'on';
    });
  };

  const leave = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.dataset.spot = 'off';
  };

  return (
    <h1
      ref={ref}
      onPointerMove={move}
      onPointerDown={move}
      onPointerLeave={leave}
      onPointerCancel={leave}
      data-spot="off"
      className={cn('group/spot relative', className)}
    >
      {name}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 text-brick opacity-0 transition-opacity duration-300 select-none group-data-[spot=on]/spot:opacity-100"
        style={{
          maskImage:
            'radial-gradient(circle 9rem at var(--spot-x, -20rem) var(--spot-y, 50%), #000 35%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(circle 9rem at var(--spot-x, -20rem) var(--spot-y, 50%), #000 35%, transparent 75%)',
        }}
      >
        {name}
      </span>
    </h1>
  );
}
