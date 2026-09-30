import { describe, expect, it } from 'vitest';
import { compareProjects, projectsUsing } from './projects';

describe('compareProjects', () => {
  it('puts newer projects first', () => {
    const sorted = [
      { title: 'A', year: 2023 },
      { title: 'B', year: 2026 },
      { title: 'C', year: 2024 },
    ].sort(compareProjects);
    expect(sorted.map((p) => p.title)).toEqual(['B', 'C', 'A']);
  });

  it('puts explicit order before year', () => {
    const sorted = [
      { title: 'New', year: 2026 },
      { title: 'Pinned', year: 2020, order: 1 },
    ].sort(compareProjects);
    expect(sorted.map((p) => p.title)).toEqual(['Pinned', 'New']);
  });

  it('falls back to title for the same year', () => {
    const sorted = [
      { title: 'Beta', year: 2025 },
      { title: 'Alpha', year: 2025 },
    ].sort(compareProjects);
    expect(sorted.map((p) => p.title)).toEqual(['Alpha', 'Beta']);
  });
});

describe('projectsUsing', () => {
  const projects = [
    { title: 'API', stack: ['NestJS', 'MongoDB'] },
    { title: 'Site', stack: ['Next.js', ' typescript '] },
  ];

  it('matches stack entries case-insensitively', () => {
    expect(projectsUsing('mongodb', projects).map((p) => p.title)).toEqual(['API']);
    expect(projectsUsing('TypeScript', projects).map((p) => p.title)).toEqual(['Site']);
  });

  it('returns nothing for unused tech', () => {
    expect(projectsUsing('Go', projects)).toEqual([]);
  });
});
