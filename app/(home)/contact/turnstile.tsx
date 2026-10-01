'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * Cloudflare Turnstile widget. It adds a hidden `cf-turnstile-response` input to the enclosing form.
 * `resetKey` changes after every submit, since each token can be verified only once.
 */
export function Turnstile({ siteKey, resetKey }: { siteKey: string; resetKey: unknown }) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(() => typeof window !== 'undefined' && Boolean(window.turnstile));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ready || !container.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      theme: 'auto',
      'error-callback': () => setFailed(true),
      callback: () => setFailed(false),
    });
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [ready, siteKey]);

  useEffect(() => {
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetKey]);

  return (
    <div className="flex flex-col gap-1.5">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onError={() => setFailed(true)}
      />
      <div ref={container} className="min-h-[65px]" />
      {failed && (
        <p className="text-sm text-red-700 dark:text-red-400">
          The spam check could not load. Check that nothing is blocking challenges.cloudflare.com, then reload the page.
        </p>
      )}
    </div>
  );
}
