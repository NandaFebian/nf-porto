import Link from 'next/link';
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
          <p className="text-fd-muted-foreground">{profile.role}</p>
          <SpotlightName
            name={profile.name}
            className="mt-2 w-fit text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] font-semibold tracking-tight"
          />
          <p className="mt-6 max-w-xl text-lg">
            {isPlaceholder(profile.tagline) ? <Pending what="tagline" /> : profile.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="inline-flex min-h-11 items-center rounded-md bg-brick px-5 text-sm font-medium text-brick-foreground transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97]"
            >
              View projects
            </Link>
            <CvLink />
          </div>
        </div>
        <SpecList
          className="border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
          items={[
            { label: 'based in', value: profile.location },
            ...(education ? [{ label: 'studied at', value: education.school }] : []),
            { label: 'projects', value: `${projects.length} published` },
          ]}
        />
      </section>

      {lead && (
        <section aria-labelledby="selected-work" className="border-t pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="selected-work" className="text-xl font-semibold">
              Selected work
            </h2>
            <Link href="/projects" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">
              All {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </Link>
          </div>

          <article className="group relative mt-6 grid gap-6 md:grid-cols-[3fr_2fr] md:gap-10">
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
          className="mt-20 grid gap-6 border-t pt-8 lg:grid-cols-[20rem_1fr] lg:gap-16"
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
