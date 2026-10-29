import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { profile } from '@/content/profile';
import { hasPublicFile } from '@/lib/public-files';
import { cn } from '@/lib/cn';
import { CvPreview, type CvPage } from './cv-preview';

/** Page images written by `npm run cv:pages` next to the PDF; empty until that has run. */
function readCvPages(pdf: string): CvPage[] {
  const manifest = path.join(process.cwd(), 'public', ...pdf.replace(/\.pdf$/, '.pages.json').split('/'));
  return existsSync(manifest) ? (JSON.parse(readFileSync(manifest, 'utf8')) as CvPage[]) : [];
}

export function CvLink({ className }: { className?: string }) {
  if (!hasPublicFile(profile.cv)) {
    // TODO: add the PDF at public/cv/nanda-febian-cv.pdf; the button replaces this label once it exists.
    return (
      <span className={cn('inline-flex min-h-11 items-center px-1 text-sm text-fd-muted-foreground', className)}>
        CV coming soon
      </span>
    );
  }

  const pages = readCvPages(profile.cv);
  if (pages.length > 0) return <CvPreview pdf={profile.cv} pages={pages} className={className} />;

  return (
    <a
      href={profile.cv}
      download
      className={cn(
        'inline-flex min-h-11 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-fd-accent',
        className,
      )}
    >
      Download CV (PDF)
    </a>
  );
}
