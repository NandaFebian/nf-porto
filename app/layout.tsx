import { RootProvider } from 'fumadocs-ui/provider/next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import './global.css';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { profile } from '@/content/profile';
import { appName, isPlaceholder, siteUrl } from '@/lib/shared';

// Their scripts are served from /_vercel/*, which only exists on Vercel; elsewhere they would 404.
const onVercel = process.env.VERCEL === '1';

// One variable file instead of a file per weight keeps font bytes off the LCP path.
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
});

// Mono only styles small labels and code, never the LCP element, so it is not preloaded.
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '400',
  preload: false,
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${appName}, ${profile.role}`, template: `%s · ${appName}` },
  description: isPlaceholder(profile.tagline) ? `Projects and skills of ${profile.name}.` : profile.tagline,
  openGraph: { siteName: appName, type: 'website' },
  // TODO: replace with app/icon.svg once there is an approved icon; this stops the /favicon.ico 404.
  icons: { icon: 'data:,' },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        {onVercel && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
