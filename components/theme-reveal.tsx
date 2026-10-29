'use client';

import { useEffect } from 'react';

/**
 * Fumadocs already wraps theme changes in a view transition. This records where the theme toggle
 * was pressed, before Fumadocs' own click handler runs, so the CSS can grow the new theme out of
 * that point (see `.theme-switching` in app/global.css).
 */
export function ThemeReveal() {
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;

    const onClick = (event: MouseEvent) => {
      const toggle = (event.target as Element | null)?.closest('[data-theme-toggle]');
      if (!toggle) return;
      const rect = toggle.getBoundingClientRect();
      // Keyboard activation reports 0,0; start from the toggle's center instead.
      const x = event.clientX || rect.left + rect.width / 2;
      const y = event.clientY || rect.top + rect.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.style.setProperty('--vt-x', `${x}px`);
      root.style.setProperty('--vt-y', `${y}px`);
      root.style.setProperty('--vt-r', `${radius}px`);
      root.classList.add('theme-switching');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.classList.remove('theme-switching'), 800);
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
