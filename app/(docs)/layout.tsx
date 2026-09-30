import { getProjectTree } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <DocsLayout tree={getProjectTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
