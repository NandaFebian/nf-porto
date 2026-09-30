import { profile } from '@/content/profile';
import { hasPublicFile } from '@/lib/public-files';
import { cn } from '@/lib/cn';

export function CvLink({ className }: { className?: string }) {
  if (!hasPublicFile(profile.cv)) {
    // TODO: add the PDF at public/cv/nanda-febian-cv.pdf; the button replaces this label once it exists.
    return (
      <span className={cn('inline-flex min-h-11 items-center px-1 text-sm text-fd-muted-foreground', className)}>
        CV coming soon
      </span>
    );
  }

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
