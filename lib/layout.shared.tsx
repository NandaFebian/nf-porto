import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { NfMark } from '@/components/nf-mark';
import { appName } from './shared';

export const navLinks = [
  { text: 'Projects', url: '/projects' },
  { text: 'Skills', url: '/skills' },
  { text: 'About', url: '/about' },
  { text: 'Contact', url: '/contact' },
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2.5">
          <NfMark width={28} />
          {appName}
        </span>
      ),
    },
    links: navLinks.map((link) => ({ ...link, active: 'nested-url' })),
  };
}
