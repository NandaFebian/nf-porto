import { profile } from '@/content/profile';
import { isPlaceholder, siteUrl } from '@/lib/shared';

export function PersonJsonLd() {
  const sameAs = Object.values(profile.socials).filter((url) => !isPlaceholder(url));
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    url: siteUrl,
    address: { '@type': 'PostalAddress', addressLocality: profile.location },
    alumniOf: profile.education.map((item) => ({ '@type': 'CollegeOrUniversity', name: item.school })),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so profile text cannot close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
