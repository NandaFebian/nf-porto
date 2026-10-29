'use client';

import { useEffect, useRef } from 'react';
import { NfMark } from './nf-mark';

/** The header logo. Its arms grow in on load (CSS), and hovering the site title replays that. */
export function HeaderMark() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const link = ref.current?.closest('a');
    const arms = ref.current?.querySelectorAll<SVGRectElement>('.nf-arm');
    if (!link || !arms) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const replay = () => {
      if (reduced.matches) return;
      arms.forEach((arm, index) =>
        arm.animate([{ scale: '0 1' }, { scale: '1 1' }], {
          duration: 480,
          delay: index * 70,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards',
        }),
      );
    };
    link.addEventListener('pointerenter', replay);
    return () => link.removeEventListener('pointerenter', replay);
  }, []);

  return (
    <span ref={ref} className="inline-flex">
      <NfMark width={28} animated />
    </span>
  );
}
