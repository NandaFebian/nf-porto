import { profileSchema } from '@/lib/content-schema';

// TODO: replace placeholder values (marked TODO) with real data.
export const profile = profileSchema.parse({
  name: 'Nanda Febian',
  role: 'Backend / Full-stack Developer',
  tagline: 'TODO: one sentence about what you build and what you care about.',
  location: 'Bali, Indonesia',
  email: 'todo@example.com',
  cv: '/cv/nanda-febian-cv.pdf',
  socials: {
    github: 'https://github.com/TODO',
    linkedin: 'https://www.linkedin.com/in/TODO',
  },
  education: [
    {
      school: 'Universitas Udayana',
      degree: 'TODO: degree and major',
      period: 'TODO',
    },
  ],
  // Sections on /about stay hidden while these are empty.
  experience: [],
  publications: [],
  certifications: [],
});
