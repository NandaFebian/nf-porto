'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

const MAX_DEG = 4;

/**
 * Tilts its child a few degrees toward a mouse or pen pointer anywhere on the enclosing card,
 * so the whole card reads as one target. Touch input and reduced-motion users get no tilt.
 */
export function TiltSurface({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    // The card's stretched link covers this element, so listen on the card itself.
    const card = element?.closest('article');
    if (!element || !card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reduced.matches) return;
      const rect = element.getBoundingClientRect();
      const px = Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5));
      const py = Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.transform = `perspective(900px) rotateX(${(-py * MAX_DEG).toFixed(2)}deg) rotateY(${(px * MAX_DEG).toFixed(2)}deg) scale(1.015)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      element.style.transform = '';
    };

    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', reset);
    return () => {
      cancelAnimationFrame(frame);
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <div ref={ref} className={cn('transition-transform duration-300 ease-out', className)}>
      {children}
    </div>
  );
}
