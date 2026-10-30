import { notFound } from 'next/navigation';
import { renderOgCard } from '@/lib/og-card';
import { ogCardFor, ogImageParams } from '@/lib/site-metadata';

// Rendered once at build time; pages point at these through metadata.openGraph.images.
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return ogImageParams();
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string[] }> }) {
  const card = ogCardFor((await params).image);
  if (!card) notFound();
  return renderOgCard(card);
}
