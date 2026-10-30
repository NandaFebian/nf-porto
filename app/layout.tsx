import { RootProvider } from 'fumadocs-ui/provider/next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import './global.css';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { ThemeReveal } from '@/components/theme-reveal';
import { profile } from '@/content/profile';
import { appName, siteUrl } from '@/lib/shared';
import { homeDescription, homeTitle, ogImageUrl, socialMetadata } from '@/lib/site-metadata';

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

const homeSocial = socialMetadata({
  title: homeTitle,
  description: homeDescription,
  path: '/',
  image: ogImageUrl.home,
  imageAlt: `${profile.name}, ${profile.role}`,
});

export const metadata: Metadata = {
  // Turns the relative og:image and og:url paths into the absolute URLs that link previews require.
  metadataBase: new URL(siteUrl),
  title: { default: homeTitle, template: `%s · ${appName}` },
  description: homeDescription,
  // Defaults for pages without their own, such as the 404 page. The canonical URL stays per page.
  openGraph: homeSocial.openGraph,
  twitter: homeSocial.twitter,
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <ThemeReveal />
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
