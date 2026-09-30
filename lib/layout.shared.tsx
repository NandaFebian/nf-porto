import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
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
      title: appName,
    },
    links: navLinks.map((link) => ({ ...link, active: 'nested-url' })),
  };
}
