import { describe, expect, it } from 'vitest';
import {
  categorySlug,
  collectStack,
  compareProjects,
  filterProjects,
  parseProjectFilter,
  projectsUsing,
} from './projects';

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

describe('categorySlug', () => {
  it('turns categories into URL values', () => {
    expect(categorySlug('Web App')).toBe('web-app');
    expect(categorySlug('UI/UX')).toBe('ui-ux');
  });
});

describe('parseProjectFilter', () => {
  it('reads type and repeated, normalized, de-duplicated tags', () => {
    const filter = parseProjectFilter(new URLSearchParams('type=backend&tag=NestJS&tag=mongodb&tag=nestjs'));
    expect(filter).toEqual({ type: 'backend', tags: ['nestjs', 'mongodb'] });
  });

  it('returns an empty filter for no params', () => {
    expect(parseProjectFilter(new URLSearchParams())).toEqual({ type: undefined, tags: [] });
  });
});

describe('filterProjects', () => {
  const projects = [
    { title: 'API', category: 'Backend', stack: ['NestJS', 'MongoDB'] },
    { title: 'Admin', category: 'Web App', stack: ['Next.js', 'NestJS'] },
    { title: 'Paper', category: 'Research', stack: ['Python'] },
  ];
  const titles = (list: { title: string }[]) => list.map((p) => p.title);

  it('returns everything without a filter', () => {
    expect(titles(filterProjects(projects, { tags: [] }))).toEqual(['API', 'Admin', 'Paper']);
  });

  it('requires every selected tag', () => {
    expect(titles(filterProjects(projects, { tags: ['nestjs'] }))).toEqual(['API', 'Admin']);
    expect(titles(filterProjects(projects, { tags: ['nestjs', 'mongodb'] }))).toEqual(['API']);
  });

  it('combines type and tags', () => {
    expect(titles(filterProjects(projects, { type: 'web-app', tags: ['nestjs'] }))).toEqual(['Admin']);
    expect(filterProjects(projects, { type: 'research', tags: ['nestjs'] })).toEqual([]);
  });
});

describe('collectStack', () => {
  it('counts each technology once per project, most used first', () => {
    const stack = collectStack([{ stack: ['NestJS', 'MongoDB'] }, { stack: ['nestjs', 'Next.js', 'NestJS'] }]);
    expect(stack).toEqual([
      { tag: 'nestjs', label: 'NestJS', count: 2 },
      { tag: 'mongodb', label: 'MongoDB', count: 1 },
      { tag: 'next.js', label: 'Next.js', count: 1 },
    ]);
  });
});
