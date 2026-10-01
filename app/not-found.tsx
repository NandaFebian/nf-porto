import { HomeLayout } from 'fumadocs-ui/layouts/home';
import Link from 'next/link';
import { baseOptions } from '@/lib/layout.shared';

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center gap-4 px-4 py-20 sm:px-6">
        <p className="font-mono text-xs text-fd-muted-foreground">404</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">This page does not exist</h1>
        <p className="max-w-prose text-fd-muted-foreground">
          The link may point to a project that was renamed or removed. Every published project is listed on the projects
          page.
        </p>
        <Link
          href="/projects"
          className="mt-2 inline-flex min-h-11 items-center rounded-md bg-brick px-5 text-sm font-medium text-brick-foreground transition-opacity hover:opacity-90"
        >
          Go to projects
        </Link>
      </div>
    </HomeLayout>
  );
}
