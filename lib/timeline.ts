export type TimelineKind = 'project' | 'publication' | 'certification';

export interface TimelineItem {
  kind: TimelineKind;
  year: number;
  title: string;
  detail: string;
  href?: string;
}

const kindOrder: Record<TimelineKind, number> = { project: 0, publication: 1, certification: 2 };

/** Dated items grouped by year, newest year first; within a year, projects, then publications, then certifications. */
export function groupTimeline(items: TimelineItem[]): { year: number; items: TimelineItem[] }[] {
  const byYear = new Map<number, TimelineItem[]>();
  for (const item of items) byYear.set(item.year, [...(byYear.get(item.year) ?? []), item]);
  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, list]) => ({
      year,
      items: [...list].sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind] || a.title.localeCompare(b.title)),
    }));
}
