import { describe, expect, it } from 'vitest';
import { groupTimeline, type TimelineItem } from './timeline';

describe('groupTimeline', () => {
  it('groups by year, newest first, ordering kinds within a year', () => {
    const items: TimelineItem[] = [
      { kind: 'certification', year: 2025, title: 'Cert', detail: 'Issuer' },
      { kind: 'project', year: 2026, title: 'B project', detail: 'Backend' },
      { kind: 'publication', year: 2025, title: 'Paper', detail: 'Journal' },
      { kind: 'project', year: 2026, title: 'A project', detail: 'Web App' },
      { kind: 'project', year: 2025, title: 'Older', detail: 'Research' },
    ];
    expect(groupTimeline(items).map((g) => [g.year, g.items.map((i) => i.title)])).toEqual([
      [2026, ['A project', 'B project']],
      [2025, ['Older', 'Paper', 'Cert']],
    ]);
  });

  it('returns nothing for no items', () => {
    expect(groupTimeline([])).toEqual([]);
  });
});
