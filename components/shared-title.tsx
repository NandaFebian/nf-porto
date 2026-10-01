'use client';

import { ViewTransition, type ReactNode } from 'react';

/** Pairs a project's card title with its detail page heading, so navigating between them morphs one into the other. */
export function SharedProjectTitle({ url, children }: { url: string; children: ReactNode }) {
  const slug = url.split('/').filter(Boolean).pop() ?? url;
  return (
    <ViewTransition name={`project-title-${slug}`} share="project-title" default="none">
      {children}
    </ViewTransition>
  );
}
