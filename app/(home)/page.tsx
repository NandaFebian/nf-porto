import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CvLink } from '@/components/cv-link';
import { Pending } from '@/components/pending';
import { PersonJsonLd } from '@/components/person-json-ld';
import { ProjectCard, ProjectCover, ProjectTitleLink, StackList, StatusLabel } from '@/components/project-card';
import { SharedProjectTitle } from '@/components/shared-title';
import { SpotlightName } from '@/components/spotlight-name';
import { SpecList } from '@/components/spec-list';
import { profile } from '@/content/profile';
import { skillLevels } from '@/lib/content-schema';
import { getProjectSummaries } from '@/lib/public-files';
import { isPlaceholder } from '@/lib/shared';
import { getSkillsWithProjects } from '@/lib/skills';
import { homeDescription, homeTitle, ogImageUrl, socialMetadata } from '@/lib/site-metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = socialMetadata({
  title: homeTitle,
  description: homeDescription,
  path: '/',
  image: ogImageUrl.home,
  imageAlt: `${profile.name}, ${profile.role}`,
});

const step = (index: number) => ({ '--step': index }) as CSSProperties;

export default function HomePage() {
  const projects = getProjectSummaries();
  const featured = projects.filter((project) => project.featured);
  const selected = (featured.length > 0 ? featured : projects).slice(0, 4);
  const [lead, ...rest] = selected;

  const skills = getSkillsWithProjects()
    .map((skill, index) => ({ skill, index }))
    .sort((a, b) => skillLevels.indexOf(a.skill.level) - skillLevels.indexOf(b.skill.level) || a.index - b.index)
    .slice(0, 8)
    .map(({ skill }) => skill);

  const education = profile.education[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <PersonJsonLd />

      <section className="grid gap-10 pt-12 pb-14 md:pt-20 md:pb-20 lg:grid-cols-[1fr_20rem] lg:items-end lg:gap-16">
        <div>
          <p className="hero-step font-medium text-brand" style={step(0)}>
            {profile.role}
          </p>
          <div className="hero-step" style={step(1)}>
            <SpotlightName
              name={profile.name}
              className="mt-2 w-fit text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] font-semibold tracking-tight"
            />
          </div>
          <p className="hero-step mt-6 max-w-xl text-lg" style={step(2)}>
            {isPlaceholder(profile.tagline) ? <Pending what="tagline" /> : profile.tagline}
          </p>
          <div className="hero-step mt-8 flex flex-wrap items-center gap-3" style={step(3)}>
            <Link
              href="/projects"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brand px-5 text-sm font-medium text-brand-foreground transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97]"
            >
              View projects
              <ArrowRight aria-hidden className="nudge-arrow size-4" />
            </Link>
            <CvLink />
          </div>
        </div>
        <SpecList
          className="hero-step border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
          style={step(4)}
          items={[
            { label: 'based in', value: profile.location },
            ...(education ? [{ label: 'studied at', value: education.school }] : []),
            { label: 'projects', value: `${projects.length} published` },
          ]}
        />
      </section>

      {lead && (
        <section aria-labelledby="selected-work" className="accent-rule border-t pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="selected-work" className="text-xl font-semibold">
              Selected work
            </h2>
            <Link
              href="/projects"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm underline underline-offset-4"
            >
              All {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              <ArrowRight aria-hidden className="nudge-arrow size-3.5" />
            </Link>
          </div>

          <article className="reveal group relative mt-6 grid gap-6 md:grid-cols-[3fr_2fr] md:gap-10">
            <ProjectCover project={lead} sizes="(min-width: 768px) 60vw, 100vw" priority />
            <div className="flex flex-col gap-4 md:py-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs text-fd-muted-foreground">
                  {lead.year} · {lead.category}
                </span>
                <StatusLabel status={lead.status} />
              </div>
              <SharedProjectTitle url={lead.url}>
                <h3 className="w-fit text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                  <ProjectTitleLink project={lead} />
                </h3>
              </SharedProjectTitle>
              <p className="text-fd-muted-foreground">{lead.summary}</p>
              <SpecList items={[{ label: 'role', value: lead.role }]} />
              <StackList stack={lead.stack} className="mt-auto" />
            </div>
          </article>

          {rest.length > 0 && (
            <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((project) => (
                <ProjectCard key={project.url} project={project} />
              ))}
            </div>
          )}
        </section>
      )}

      {skills.length > 0 && (
        <section
          aria-labelledby="core-skills"
          className="reveal accent-rule mt-20 grid gap-6 border-t pt-8 lg:grid-cols-[20rem_1fr] lg:gap-16"
        >
          <div>
            <h2 id="core-skills" className="text-xl font-semibold">
              Core skills
            </h2>
            <Link
              href="/skills"
              className="mt-1 inline-flex min-h-11 items-center text-sm underline underline-offset-4"
            >
              Full list with levels
            </Link>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {skills.map((skill) => (
              <li key={skill.name} className="flex items-baseline justify-between gap-4 border-b py-2.5">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-fd-muted-foreground">
                  {skill.level}
                  {skill.projects.length > 0 &&
                    ` · ${skill.projects.length} ${skill.projects.length === 1 ? 'project' : 'projects'}`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
