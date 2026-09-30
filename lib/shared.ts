export const appName = 'Nanda Febian';
export const projectsRoute = '/projects';

// The production domain is still undecided; set NEXT_PUBLIC_SITE_URL on deploy.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

/** Content values still marked TODO, or on the reserved example.com domain, are shown as pending, never as real links. */
export function isPlaceholder(value: string | undefined): boolean {
  return !value || value.includes('TODO') || /@example\.com$/i.test(value);
}
