import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { SharedProjectTitle } from '@/components/shared-title';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';

export default async function Page(props: PageProps<'/projects/[slug]'>) {
  const { slug } = await props.params;
  const page = source.getPage([slug]);
  if (!page) notFound();

  const { data } = page;
  const MDX = data.body;
  const links = Object.entries(data.links ?? {}).filter(([, href]) => href);

  return (
    <DocsPage toc={data.toc} full={data.full}>
      <SharedProjectTitle url={page.url}>
        <DocsTitle className="w-fit">{data.title}</DocsTitle>
      </SharedProjectTitle>
      <DocsDescription className="mb-0">{data.summary}</DocsDescription>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border-b pb-6 text-sm sm:grid-cols-4">
        <div>
          <dt className="font-mono text-xs lowercase text-fd-muted-foreground">Role</dt>
          <dd className="font-medium">{data.role}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs lowercase text-fd-muted-foreground">Year</dt>
          <dd className="font-medium">{data.year}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs lowercase text-fd-muted-foreground">Category</dt>
          <dd className="font-medium">{data.category}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs lowercase text-fd-muted-foreground">Status</dt>
          <dd className="font-medium">{data.status}</dd>
        </div>
        <div className="col-span-full">
          <dt className="sr-only">Stack</dt>
          <dd className="flex flex-wrap gap-1.5">
            {data.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border bg-fd-secondary px-2 py-0.5 text-xs text-fd-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </dd>
        </div>
        {links.length > 0 && (
          <div className="col-span-full">
            <dt className="sr-only">Links</dt>
            <dd className="flex flex-wrap gap-4">
              {links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium capitalize underline underline-offset-4"
                >
                  {label}
                </a>
              ))}
            </dd>
          </div>
        )}
      </dl>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: page.slugs[0] }));
}

export async function generateMetadata(props: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const page = source.getPage([slug]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.summary,
  };
}
