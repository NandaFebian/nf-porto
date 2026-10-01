import type { Metadata } from 'next';
import { CvLink } from '@/components/cv-link';
import { Pending } from '@/components/pending';
import { PersonJsonLd } from '@/components/person-json-ld';
import { SpecList } from '@/components/spec-list';
import { profile } from '@/content/profile';
import { getProjectSummaries } from '@/lib/public-files';
import { isPlaceholder } from '@/lib/shared';
import { groupTimeline } from '@/lib/timeline';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: `Education, experience, publications, and certifications of ${profile.name}, with a downloadable CV.`,
};

function Field({ value, what }: { value: string; what: string }) {
  return isPlaceholder(value) ? <Pending what={what} /> : <>{value}</>;
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t pt-6 md:grid-cols-[12rem_1fr] md:gap-8">
      <h2 id={id} className="text-lg font-semibold">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

export default function AboutPage() {
  const links = [
    { label: 'GitHub', href: profile.socials.github },
    { label: 'LinkedIn', href: profile.socials.linkedin },
  ];

  const timeline = groupTimeline([
    ...getProjectSummaries().map((project) => ({
      kind: 'project' as const,
      year: project.year,
      title: project.title,
      detail: `${project.role}, ${project.status.toLowerCase()}`,
      href: project.url,
    })),
    ...profile.publications.map((item) => ({
      kind: 'publication' as const,
      year: item.year,
      title: item.title,
      detail: item.venue,
      href: item.url,
    })),
    ...profile.certifications.map((item) => ({
      kind: 'certification' as const,
      year: item.year,
      title: item.name,
      detail: item.issuer,
      href: item.url,
    })),
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-10 pb-20 sm:px-6 md:pt-16">
      <PersonJsonLd />
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">About</h1>
      <p className="mt-4 max-w-prose text-lg">
        <Field value={profile.tagline} what="tagline" />
      </p>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <SpecList
          items={[
            { label: 'name', value: profile.name },
            { label: 'role', value: profile.role },
            { label: 'based in', value: profile.location },
            ...links.map((link) => ({
              label: link.label.toLowerCase(),
              value: isPlaceholder(link.href) ? (
                <Pending what={`${link.label} URL`} />
              ) : (
                <a href={link.href} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                  {link.href.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              ),
            })),
          ]}
        />
        <CvLink className="self-start" />
      </div>

      <div className="mt-14 flex flex-col gap-12">
        {profile.experience.length > 0 && (
          <Section id="experience" title="Experience">
            <ol className="flex flex-col gap-6">
              {profile.experience.map((item) => (
                <li key={`${item.organization}-${item.period}`}>
                  <p className="font-medium">
                    {item.role}, {item.organization}
                  </p>
                  <p className="font-mono text-xs text-fd-muted-foreground">{item.period}</p>
                  {item.summary && <p className="mt-2 text-fd-muted-foreground">{item.summary}</p>}
                </li>
              ))}
            </ol>
          </Section>
        )}

        {profile.education.length > 0 && (
          <Section id="education" title="Education">
            <ol className="flex flex-col gap-6">
              {profile.education.map((item) => (
                <li key={`${item.school}-${item.period}`}>
                  <p className="font-medium">{item.school}</p>
                  <p className="text-fd-muted-foreground">
                    <Field value={item.degree} what="degree and major" />
                  </p>
                  <p className="font-mono text-xs text-fd-muted-foreground">
                    <Field value={item.period} what="period" />
                  </p>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {profile.publications.length > 0 && (
          <Section id="publications" title="Publications">
            <ol className="flex flex-col gap-6">
              {profile.publications.map((item) => (
                <li key={item.title}>
                  <p className="font-medium">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </p>
                  <p className="text-fd-muted-foreground">
                    {item.venue}, {item.year}
                  </p>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {profile.certifications.length > 0 && (
          <Section id="certifications" title="Certifications">
            <ul className="divide-y">
              {profile.certifications.map((item) => (
                <li
                  key={`${item.name}-${item.year}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 py-3 first:pt-0"
                >
                  <span className="font-medium">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </span>
                  <span className="text-sm text-fd-muted-foreground">
                    {item.issuer}, {item.year}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {timeline.length > 0 && (
          <Section id="timeline" title="Timeline">
            <ol className="flex flex-col gap-8 border-l pl-5">
              {timeline.map((group) => (
                <li key={group.year}>
                  <p className="relative font-mono text-xs text-fd-muted-foreground">
                    <span
                      aria-hidden
                      className="absolute top-1/2 left-[calc(-1.5rem-0.5px)] size-2 -translate-y-1/2 rounded-full border-2 border-fd-background bg-fd-foreground"
                    />
                    {group.year}
                  </p>
                  <ul className="mt-2 flex flex-col gap-3">
                    {group.items.map((item) => (
                      <li key={`${item.kind}-${item.title}`}>
                        <p className="font-medium">
                          {item.href ? (
                            <Link href={item.href} className="draw-underline">
                              {item.title}
                            </Link>
                          ) : (
                            item.title
                          )}
                        </p>
                        <p className="text-sm text-fd-muted-foreground">
                          <span className="font-mono text-xs">{item.kind}</span> · {item.detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Section>
        )}
      </div>
    </div>
  );
}
