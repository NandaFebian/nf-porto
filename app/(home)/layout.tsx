import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { PageTransition } from '@/components/page-transition';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()}>
      <PageTransition>{children}</PageTransition>
    </HomeLayout>
  );
}
