import { describe, expect, it } from 'vitest';
import { skillsSchema } from './content-schema';
import { skills } from '@/content/skills';
import { profile } from '@/content/profile';

describe('skillsSchema', () => {
  it('rejects duplicate skill names regardless of case', () => {
    const result = skillsSchema.safeParse([
      { name: 'NestJS', category: 'Backend', level: 'Advanced', icon: 'nestjs' },
      { name: 'nestjs', category: 'Backend', level: 'Beginner', icon: 'nestjs' },
    ]);
    expect(result.success).toBe(false);
  });

  it('rejects unknown levels', () => {
    const result = skillsSchema.safeParse([
      { name: 'Go', category: 'Languages', level: 'Expert', icon: 'go' },
    ]);
    expect(result.success).toBe(false);
  });
});

describe('content data', () => {
  it('loads valid skills and profile', () => {
    expect(skills.length).toBeGreaterThan(0);
    expect(profile.name).toBe('Nanda Febian');
  });
});
