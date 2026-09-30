import { z } from 'zod';
import { normalizeTech } from './projects';

export const skillCategories = [
  'Languages',
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
] as const;
export const skillLevels = ['Advanced', 'Intermediate', 'Beginner'] as const;

export const skillSchema = z.object({
  name: z.string().min(1),
  category: z.enum(skillCategories),
  level: z.enum(skillLevels),
  /** Simple Icons slug, see https://simpleicons.org */
  icon: z.string().min(1),
});

export const skillsSchema = z.array(skillSchema).superRefine((skills, ctx) => {
  const seen = new Set<string>();
  skills.forEach((skill, index) => {
    const key = normalizeTech(skill.name);
    if (seen.has(key)) {
      ctx.addIssue({ code: 'custom', path: [index, 'name'], message: `Duplicate skill "${skill.name}"` });
    }
    seen.add(key);
  });
});

export type Skill = z.infer<typeof skillSchema>;

export const profileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1).max(200),
  location: z.string().min(1),
  email: z.email(),
  cv: z.string().regex(/^\/cv\/.+\.pdf$/),
  socials: z.object({
    github: z.url(),
    linkedin: z.url(),
  }),
  education: z.array(
    z.object({
      school: z.string().min(1),
      degree: z.string().min(1),
      period: z.string().min(1),
    }),
  ),
});

export type Profile = z.infer<typeof profileSchema>;
