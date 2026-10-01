'use client';

import { useTheme } from 'next-themes';
import { useEffect, useId, useRef, useState } from 'react';

type State = { status: 'loading' } | { status: 'ready'; svg: string } | { status: 'error'; message: string };

/**
 * Renders a ```mermaid code block from MDX. The library (~1 MB) loads only once a diagram
 * comes near the viewport, so it never competes with the initial page load.
 */
export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const { resolvedTheme } = useTheme();
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    const element = box.current;
    if (!element || visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setVisible(true);
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          fontFamily: 'inherit',
          theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
          // The dark theme's default edge label (#ccc on #585858) is 4.43:1; this background makes it 8.46:1.
          ...(resolvedTheme === 'dark' && { themeVariables: { edgeLabelBackground: '#2e2e2e' } }),
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled) setState({ status: 'ready', svg });
      } catch (error) {
        if (!cancelled) setState({ status: 'error', message: error instanceof Error ? error.message : String(error) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme, visible]);

  if (state.status === 'error') {
    return (
      <div role="alert" className="not-prose my-6 rounded-md border p-4 text-sm">
        <p className="font-medium">This diagram could not be drawn.</p>
        <p className="mt-1 text-fd-muted-foreground">{state.message}</p>
        <pre className="mt-3 overflow-x-auto font-mono text-xs">{chart}</pre>
      </div>
    );
  }

  if (state.status === 'loading') {
    return (
      <div
        ref={box}
        className="not-prose my-6 flex min-h-24 items-center rounded-md border p-4 font-mono text-xs text-fd-muted-foreground"
      >
        <span aria-live="polite">Drawing diagram…</span>
      </div>
    );
  }

  return (
    <div
      className="not-prose my-6 overflow-x-auto rounded-md border p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: state.svg }}
    />
  );
}
