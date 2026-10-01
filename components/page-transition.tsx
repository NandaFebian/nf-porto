'use client';

import { usePathname } from 'next/navigation';
import { ViewTransition, type ReactNode } from 'react';

/**
 * Keyed by pathname so a navigation exits the old page and enters the new one,
 * while in-page updates (like filter changes) skip the page animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" update="none" default="none">
      {children}
    </ViewTransition>
  );
}
