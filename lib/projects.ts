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
