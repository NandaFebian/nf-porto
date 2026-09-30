// Pure helpers over project frontmatter. Kept free of the MDX source so they
// can be unit tested.

export interface SortableProject {
  title: string;
  year: number;
  order?: number;
}

/** Explicit `order` first (ascending), then newest year, then title. */
export function compareProjects(a: SortableProject, b: SortableProject): number {
  const orderA = a.order ?? Number.POSITIVE_INFINITY;
  const orderB = b.order ?? Number.POSITIVE_INFINITY;
  if (orderA !== orderB) return orderA - orderB;
  if (a.year !== b.year) return b.year - a.year;
  return a.title.localeCompare(b.title);
}

export function normalizeTech(name: string): string {
  return name.trim().toLowerCase();
}

/** Projects whose `stack` includes the given technology (case-insensitive). */
export function projectsUsing<P extends { stack: string[] }>(tech: string, projects: P[]): P[] {
  const key = normalizeTech(tech);
  return projects.filter((project) => project.stack.some((item) => normalizeTech(item) === key));
}

/** URL value for a category, e.g. "Web App" -> "web-app". */
export function categorySlug(category: string): string {
  return category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface ProjectFilter {
  type?: string;
  tags: string[];
}

export function parseProjectFilter(params: URLSearchParams): ProjectFilter {
  return {
    type: params.get('type') ?? undefined,
    tags: [...new Set(params.getAll('tag').map(normalizeTech).filter(Boolean))],
  };
}

/** Tags combine with AND: a project must use every selected technology. */
export function filterProjects<P extends { category: string; stack: string[] }>(
  projects: P[],
  filter: ProjectFilter,
): P[] {
  return projects.filter((project) => {
    if (filter.type && categorySlug(project.category) !== filter.type) return false;
    const stack = new Set(project.stack.map(normalizeTech));
    return filter.tags.every((tag) => stack.has(tag));
  });
}

/** Distinct technologies across projects, most used first, then alphabetical. */
export function collectStack(projects: { stack: string[] }[]): { tag: string; label: string; count: number }[] {
  const byTag = new Map<string, { tag: string; label: string; count: number }>();
  for (const project of projects) {
    const seen = new Set<string>();
    for (const tech of project.stack) {
      const tag = normalizeTech(tech);
      if (seen.has(tag)) continue;
      seen.add(tag);
      const entry = byTag.get(tag);
      if (entry) entry.count += 1;
      else byTag.set(tag, { tag, label: tech.trim(), count: 1 });
    }
  }
  return [...byTag.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
