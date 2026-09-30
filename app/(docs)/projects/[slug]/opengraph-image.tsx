import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { generateOGImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = source.getPage([slug]);
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.summary,
    site: appName,
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: page.slugs[0] }));
}
