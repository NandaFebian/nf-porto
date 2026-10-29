import { existsSync } from 'node:fs';
import path from 'node:path';
import { getProjects } from './source';

/** Whether a site path such as `/cv/file.pdf` exists under `public/`. Evaluated at build time. */
export function hasPublicFile(sitePath: string): boolean {
  return existsSync(path.join(process.cwd(), 'public', ...sitePath.split('/')));
}

export interface ProjectSummary {
  url: string;
  title: string;
  summary: string;
  role: string;
  year: number;
  status: string;
  category: string;
  stack: string[];
  featured: boolean;
  /** Null until the cover image is added to `public/`. */
  cover: string | null;
  /** Dark-theme version of the cover, when one sits beside it; otherwise the cover shows in both themes. */
  coverDark: string | null;
}

/** `/projects/x/cover.png` → `/projects/x/cover-dark.png`; scripts/generate-covers.mjs writes the same name. */
export function darkCoverPath(cover: string): string {
  return cover.replace(/(\.\w+)$/, '-dark$1');
}

/** Serializable project data for cards, in `getProjects()` order. */
export function getProjectSummaries(): ProjectSummary[] {
  return getProjects().map(({ url, data }) => ({
    url,
    title: data.title,
    summary: data.summary,
    role: data.role,
    year: data.year,
    status: data.status,
    category: data.category,
    stack: data.stack,
    featured: data.featured,
    cover: hasPublicFile(data.cover) ? data.cover : null,
    coverDark: hasPublicFile(darkCoverPath(data.cover)) ? darkCoverPath(data.cover) : null,
  }));
}
