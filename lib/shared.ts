export const appName = 'Nanda Febian';
export const projectsRoute = '/projects';

export const productionUrl = 'https://nandafebian.my.id';

/**
 * The site's origin, used for canonical links, the sitemap, and the absolute og:image URLs that
 * LinkedIn and WhatsApp need. Preview deployments point there too, so a shared preview link still
 * credits the real domain. NEXT_PUBLIC_SITE_URL overrides it; values that are not full URLs are skipped.
 */
export function resolveSiteUrl(env: Record<string, string | undefined>): string {
  const override = env.NEXT_PUBLIC_SITE_URL;
  if (override && URL.canParse(override)) {
    const url = new URL(override);
    if (url.hostname) return url.origin;
  }
  return productionUrl;
}

export const siteUrl = resolveSiteUrl(process.env);

/** Content values still marked TODO, or on the reserved example.com domain, are shown as pending, never as real links. */
export function isPlaceholder(value: string | undefined): boolean {
  return !value || value.includes('TODO') || /@example\.com$/i.test(value);
}
