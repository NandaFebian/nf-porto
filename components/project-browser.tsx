'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProjectCard } from '@/components/project-card';
import { cn } from '@/lib/cn';
import type { ProjectSummary } from '@/lib/public-files';
import { categorySlug, collectStack, filterProjects, parseProjectFilter, type ProjectFilter } from '@/lib/projects';

function toSearch(filter: ProjectFilter): string {
  const params = new URLSearchParams();
  if (filter.type) params.set('type', filter.type);
  for (const tag of filter.tags) params.append('tag', tag);
  const query = params.toString();
  return query ? `?${query}` : '';
}

function FilterButton({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'min-h-11 rounded-md border px-3 text-sm transition-colors',
        pressed
          ? 'border-brick bg-brick text-brick-foreground'
          : 'text-fd-muted-foreground hover:border-fd-foreground/40 hover:text-fd-foreground',
      )}
    >
      {children}
    </button>
  );
}

export function ProjectBrowser({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const filter = parseProjectFilter(new URLSearchParams(useSearchParams().toString()));
  return (
    <ProjectBrowserView
      projects={projects}
      filter={filter}
      onChange={(next) => router.replace(`${pathname}${toSearch(next)}`, { scroll: false })}
    />
  );
}

/** Stateless view; also used as the Suspense fallback with an empty filter. */
export function ProjectBrowserView({
  projects,
  filter,
  onChange,
}: {
  projects: ProjectSummary[];
  filter: ProjectFilter;
  onChange?: (filter: ProjectFilter) => void;
}) {
  const categories = [...new Set(projects.map((project) => project.category))];
  const stack = collectStack(projects);
  const results = filterProjects(projects, filter);
  const active = Boolean(filter.type) || filter.tags.length > 0;
  const labelFor = (tag: string) => stack.find((item) => item.tag === tag)?.label ?? tag;

  const toggleTag = (tag: string) =>
    onChange?.({
      ...filter,
      tags: filter.tags.includes(tag) ? filter.tags.filter((t) => t !== tag) : [...filter.tags, tag],
    });
  const toggleType = (type: string) => onChange?.({ ...filter, type: filter.type === type ? undefined : type });
  const clear = () => onChange?.({ tags: [] });

  if (projects.length === 0) {
    return <p className="text-fd-muted-foreground">No projects are published yet. New ones appear here once their MDX file is added.</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 border-y py-5">
        {categories.length > 1 && (
          <div role="group" aria-labelledby="filter-type" className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <span id="filter-type" className="font-mono text-xs text-fd-muted-foreground sm:w-14 sm:leading-11">
              type
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <FilterButton
                  key={category}
                  pressed={filter.type === categorySlug(category)}
                  onClick={() => toggleType(categorySlug(category))}
                >
                  {category}
                </FilterButton>
              ))}
            </div>
          </div>
        )}
        <div role="group" aria-labelledby="filter-stack" className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
          <span id="filter-stack" className="font-mono text-xs text-fd-muted-foreground sm:w-14 sm:leading-11">
            stack
          </span>
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <FilterButton key={item.tag} pressed={filter.tags.includes(item.tag)} onClick={() => toggleTag(item.tag)}>
                {item.label}
              </FilterButton>
            ))}
          </div>
        </div>
        <div className="flex min-h-11 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <p aria-live="polite" className="text-fd-muted-foreground">
            {results.length} of {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
          {active && (
            <button type="button" onClick={clear} className="min-h-11 font-medium underline underline-offset-4">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((project) => (
            <ProjectCard key={project.url} project={project} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 py-6">
          <p>
            No project matches{' '}
            {[
              ...(filter.type ? [categories.find((c) => categorySlug(c) === filter.type) ?? filter.type] : []),
              ...filter.tags.map(labelFor),
            ].join(' + ')}
            .
          </p>
          <button type="button" onClick={clear} className="min-h-11 font-medium underline underline-offset-4">
            Clear filters and show all projects
          </button>
        </div>
      )}
    </div>
  );
}
