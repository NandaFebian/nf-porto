import { skills } from '@/content/skills';
import { skillCategories, type Skill } from './content-schema';
import { categorySlug, projectsUsing } from './projects';
import { getProjects } from './source';

export type SkillWithProjects = Skill & {
  projects: { title: string; url: string }[];
};

/** Fragment id of a skill row on /skills, e.g. "Next.js" -> "skill-next-js". */
export function skillAnchor(name: string): string {
  return `skill-${categorySlug(name)}`;
}

/** Skills with the projects that list them in `stack`. */
export function getSkillsWithProjects(): SkillWithProjects[] {
  const projects = getProjects().map((page) => ({
    title: page.data.title,
    url: page.url,
    stack: page.data.stack,
  }));

  return skills.map((skill) => ({
    ...skill,
    projects: projectsUsing(skill.name, projects).map(({ title, url }) => ({ title, url })),
  }));
}

/** Skills grouped in the fixed category order; empty categories are dropped. */
export function getSkillsByCategory() {
  const all = getSkillsWithProjects();
  return skillCategories
    .map((category) => ({ category, skills: all.filter((skill) => skill.category === category) }))
    .filter((group) => group.skills.length > 0);
}
