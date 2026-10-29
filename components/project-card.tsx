import Image from 'next/image';
import Link from 'next/link';
import type { ProjectSummary } from '@/lib/public-files';
import { cn } from '@/lib/cn';
import { SharedProjectTitle } from './shared-title';
import { TiltSurface } from './tilt-surface';

export function ProjectCover({
  project,
  sizes,
  priority,
  className,
}: {
  project: Pick<ProjectSummary, 'title' | 'cover' | 'category'>;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <TiltSurface className={className}>
      <div className="relative aspect-16/10 overflow-hidden rounded-md border bg-fd-muted transition-colors duration-300 group-hover:border-fd-foreground/30">
        {project.cover ? (
          <Image
            src={project.cover}
            alt={`Cover image for ${project.title}`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          // TODO: add public/projects/<slug>/cover.png; the label below stays until it exists.
          <div className="flex h-full flex-col justify-end p-4">
            <span className="font-mono text-xs text-fd-muted-foreground">cover image pending</span>
          </div>
        )}
      </div>
    </TiltSurface>
  );
}

/** Title link that covers the whole card, with an underline that draws in on hover or focus. */
export function ProjectTitleLink({ project }: { project: Pick<ProjectSummary, 'url' | 'title'> }) {
  return (
    <Link
      href={project.url}
      className="draw-underline pb-0.5 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-fd-foreground"
    >
      {project.title}
    </Link>
  );
}

export function StatusLabel({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground">
      <span
        aria-hidden
        className={cn(
          'size-1.5 rounded-full',
          status === 'In Progress' ? 'bg-fd-foreground' : 'border border-fd-muted-foreground',
        )}
      />
      {status}
    </span>
  );
}

export function StackList({ stack, className }: { stack: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Tech stack">
      {stack.map((tech) => (
        <li key={tech} className="rounded border px-1.5 py-0.5 font-mono text-xs text-fd-muted-foreground">
          {tech}
        </li>
      ))}
    </ul>
  );
}

/** Catalog card. Every project is the same kind of item, so the cards share one shape on purpose. */
export function ProjectCard({ project, headingLevel = 'h3' }: { project: ProjectSummary; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex flex-col gap-3">
      <ProjectCover project={project} sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw" />
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-xs text-fd-muted-foreground">
          {project.year} · {project.category}
        </span>
        <StatusLabel status={project.status} />
      </div>
      <SharedProjectTitle url={project.url}>
        <Heading className="w-fit text-lg font-semibold leading-snug">
          <ProjectTitleLink project={project} />
        </Heading>
      </SharedProjectTitle>
      <p className="text-sm text-fd-muted-foreground">{project.summary}</p>
      <StackList stack={project.stack} className="mt-auto" />
    </article>
  );
}
