import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/source';
import { siteUrl } from '@/lib/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/projects', '/skills', '/about', '/contact'].map((route) => ({ url: `${siteUrl}${route}` }));
  const projects = getProjects().map((page) => ({ url: `${siteUrl}${page.url}` }));
  return [...pages, ...projects];
}
