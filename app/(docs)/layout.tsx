import { getProjectTree } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { PageTransition } from '@/components/page-transition';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <DocsLayout tree={getProjectTree()} {...baseOptions()}>
      <PageTransition>{children}</PageTransition>
    </DocsLayout>
  );
}
