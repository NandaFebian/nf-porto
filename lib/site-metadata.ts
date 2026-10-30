import type { Metadata } from 'next';
import { profile } from '@/content/profile';
import type { OgCard } from './og-card';
import { ogSize } from './og-card';
import { appName, isPlaceholder } from './shared';
import { getProjects, source } from './source';

/** Titles and descriptions of the top-level pages, shared by their metadata and their preview images. */
export const pageInfo = {
  projects: {
    path: '/projects',
    title: 'Projects',
    description:
      'Every project, filterable by type and tech stack, each with a write-up of the architecture and decisions.',
  },
  skills: {
    path: '/skills',
    title: 'Skills',
    description: 'Languages, frameworks, and tools by category and depth, each linked to the projects that use it.',
  },
  about: {
    path: '/about',
    title: 'About',
    description: `Education, experience, publications, and certifications of ${profile.name}, with a downloadable CV.`,
  },
  contact: {
    path: '/contact',
    title: 'Contact',
    description: `Send ${profile.name} a message about a role, a freelance project, or research.`,
  },
} as const;

export type PageKey = keyof typeof pageInfo;

export const homeTitle = `${appName}, ${profile.role}`;
export const homeDescription = isPlaceholder(profile.tagline)
  ? `Projects and skills of ${profile.name}.`
  : profile.tagline;

/** Preview image URLs, served by app/og/[...image]/route.tsx. */
export const ogImageUrl = {
  home: '/og/home.png',
  page: (key: PageKey) => `/og/${key}.png`,
  project: (slug: string) => `/og/projects/${slug}.png`,
};

/**
 * Open Graph and Twitter tags for one page. A page that sets `openGraph` replaces its parent's
 * object instead of merging with it, so every page builds the full set here: title, description,
 * canonical URL, and a 1200x630 preview image that LinkedIn, WhatsApp, X, and Slack all accept.
 */
export function socialMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
}: {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt: string;
}): Metadata {
  const images = [{ url: image, ...ogSize, alt: imageAlt, type: 'image/png' }];
  return {
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: appName, locale: 'en_US', title, description, url: path, images },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}

export function pageMetadata(key: PageKey): Metadata {
  const { path, title, description } = pageInfo[key];
  return {
    title,
    description,
    ...socialMetadata({
      title: `${title} · ${appName}`,
      description,
      path,
      image: ogImageUrl.page(key),
      imageAlt: `${title}, ${appName}'s portfolio`,
    }),
  };
}

const profileMeta = () => [
  { label: 'based in', value: profile.location },
  ...(profile.education[0] ? [{ label: 'studied at', value: profile.education[0].school }] : []),
];

/** Every preview image as its URL segments, for static generation. */
export function ogImageParams(): { image: string[] }[] {
  return [
    { image: ['home.png'] },
    ...Object.keys(pageInfo).map((key) => ({ image: [`${key}.png`] })),
    ...getProjects().map((page) => ({ image: ['projects', `${page.slugs[0]}.png`] })),
  ];
}

/** The card for a preview image URL, or null when nothing lives there. */
export function ogCardFor(segments: string[]): OgCard | null {
  const name = segments.at(-1)?.replace(/\.png$/, '');
  if (!name || !segments.at(-1)?.endsWith('.png')) return null;

  if (segments.length === 1 && name === 'home') {
    return {
      kicker: 'portfolio',
      eyebrow: profile.role,
      title: profile.name,
      description: homeDescription,
      meta: profileMeta(),
      showName: false,
    };
  }

  if (segments.length === 1 && name in pageInfo) {
    const { title, description } = pageInfo[name as PageKey];
    return { kicker: name, title, description, meta: profileMeta() };
  }

  if (segments.length === 2 && segments[0] === 'projects') {
    const page = source.getPage([name]);
    if (!page) return null;
    const { data } = page;
    // The meta row is one line of mono text; past about 42 characters the stack would run off the card.
    const stack: string[] = [];
    for (const tech of data.stack) {
      if ([...stack, tech].join(' · ').length > 42) {
        stack.push('…');
        break;
      }
      stack.push(tech);
    }
    return {
      kicker: 'project',
      title: data.title,
      description: data.summary,
      meta: [
        { label: 'category', value: data.category },
        { label: 'year', value: String(data.year) },
        { label: 'stack', value: stack.join(' · ') },
      ],
    };
  }

  return null;
}
