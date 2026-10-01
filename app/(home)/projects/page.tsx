import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectBrowser, ProjectBrowserView } from '@/components/project-browser';
import { getProjectSummaries } from '@/lib/public-files';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Every project, filterable by type and tech stack, each with a write-up of the architecture and decisions.',
};

export default function ProjectsPage() {
  const projects = getProjectSummaries();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-20 sm:px-6 md:pt-16">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Projects</h1>
      <p className="mt-3 mb-8 max-w-prose text-fd-muted-foreground">
        Each project has its own page covering the problem, my role, the architecture, and the challenges along the way.
        Filter by type or stack; selected stack filters must all match.
      </p>
      {/* The static HTML has no query string, so it renders the unfiltered list until the client reads the URL. */}
      <Suspense fallback={<ProjectBrowserView projects={projects} filter={{ tags: [] }} />}>
        <ProjectBrowser projects={projects} />
      </Suspense>
    </div>
  );
}
