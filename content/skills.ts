import { skillsSchema } from '@/lib/content-schema';

// Related projects are derived from each project's `stack`, matched by `name`
// (case-insensitive), so keep names consistent with project frontmatter.
// TODO: review levels and add the rest of your skills.
export const skills = skillsSchema.parse([
  { name: 'TypeScript', category: 'Languages', level: 'Advanced', icon: 'typescript' },
  { name: 'NestJS', category: 'Backend', level: 'Advanced', icon: 'nestjs' },
  { name: 'MongoDB', category: 'Database', level: 'Intermediate', icon: 'mongodb' },
  { name: 'Next.js', category: 'Frontend', level: 'Intermediate', icon: 'nextdotjs' },
]);
