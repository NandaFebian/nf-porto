import { createSearchAPI, type AdvancedIndex } from 'fumadocs-core/search/server';
import { getProjects } from '@/lib/source';
import { getSkillsWithProjects, skillAnchor } from '@/lib/skills';

function buildIndexes(): AdvancedIndex[] {
  const projects: AdvancedIndex[] = getProjects().map((page) => ({
    id: page.url,
    title: page.data.title,
    description: page.data.summary,
    breadcrumbs: ['Projects'],
    url: page.url,
    structuredData: {
      ...page.data.structuredData,
      contents: [
        { heading: undefined, content: `${page.data.role} · ${page.data.stack.join(', ')}` },
        ...page.data.structuredData.contents,
      ],
    },
  }));

  const skills: AdvancedIndex[] = getSkillsWithProjects().map((skill) => {
    const usedIn = skill.projects.map((project) => project.title).join(', ');
    return {
      id: `/skills#${skillAnchor(skill.name)}`,
      title: skill.name,
      description: `${skill.category} · ${skill.level}`,
      breadcrumbs: ['Skills'],
      url: `/skills#${skillAnchor(skill.name)}`,
      structuredData: {
        headings: [],
        contents: usedIn ? [{ heading: undefined, content: `Used in ${usedIn}` }] : [],
      },
    };
  });

  return [...projects, ...skills];
}

export const { GET } = createSearchAPI('advanced', { indexes: buildIndexes() });
