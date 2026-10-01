import { generateOGImage } from 'fumadocs-ui/og';
import { profile } from '@/content/profile';
import { appName, isPlaceholder } from '@/lib/shared';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${profile.name}, ${profile.role}`;

export default function Image() {
  return generateOGImage({
    title: profile.name,
    description: isPlaceholder(profile.tagline) ? profile.role : profile.tagline,
    site: appName,
  });
}
