import type { Metadata } from 'next';
import Link from 'next/link';
import { skillLevels } from '@/lib/content-schema';
import { getSkillsByCategory, skillAnchor } from '@/lib/skills';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Languages, frameworks, and tools by category and depth, each linked to the projects that use it.',
};

function LevelMeter({ level }: { level: (typeof skillLevels)[number] }) {
  const filled = skillLevels.length - skillLevels.indexOf(level);
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="flex gap-0.5">
        {skillLevels.map((_, index) => (
          <span
            key={index}
            className={
              index < filled
                ? 'meter-fill h-2.5 w-1.5 bg-fd-foreground'
                : 'h-2.5 w-1.5 border border-fd-muted-foreground'
            }
          />
        ))}
      </span>
      <span className="text-sm">{level}</span>
    </span>
  );
}

export default function SkillsPage() {
  const groups = getSkillsByCategory();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-20 sm:px-6 md:pt-16">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Skills</h1>
      <p className="mt-3 max-w-prose text-fd-muted-foreground">
        Grouped by area, with a level for each. Where a published project uses a skill, the project is linked so you can
        see the work behind the level.
      </p>

      {groups.length === 0 ? (
        <p className="mt-10 text-fd-muted-foreground">No skills are listed yet. Add them in content/skills.ts.</p>
      ) : (
        <div className="mt-12 flex flex-col gap-12">
          {groups.map((group) => (
            <section
              key={group.category}
              aria-labelledby={`skills-${group.category}`}
              className="grid gap-4 border-t pt-6 lg:grid-cols-[12rem_1fr] lg:gap-8"
            >
              <h2 id={`skills-${group.category}`} className="text-lg font-semibold">
                {group.category}
              </h2>
              <ul className="divide-y">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    id={skillAnchor(skill.name)}
                    className="target-flash -mx-2 grid scroll-mt-20 gap-x-6 rounded-md px-2 gap-y-1 py-3 first:pt-0 sm:grid-cols-[minmax(8rem,12rem)_10rem_1fr] sm:items-baseline"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <LevelMeter level={skill.level} />
                    <span className="text-sm text-fd-muted-foreground">
                      {skill.projects.length === 0 ? (
                        'No published project uses it yet'
                      ) : (
                        <>
                          Used in{' '}
                          {skill.projects.map((project, index) => (
                            <span key={project.url}>
                              {index > 0 && ', '}
                              <Link href={project.url} className="text-fd-foreground underline underline-offset-4">
                                {project.title}
                              </Link>
                            </span>
                          ))}
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
