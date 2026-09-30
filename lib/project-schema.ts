import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

export const projectCategories = ['Web App', 'Backend', 'Research', 'UI/UX'] as const;
export const projectStatuses = ['Completed', 'In Progress'] as const;

// Frontmatter for content/projects/*.mdx. The slug comes from the file name.
export const projectSchema = pageSchema
  .omit({ description: true })
  .extend({
    summary: z.string().min(1).max(160),
    role: z.string().min(1),
    stack: z.array(z.string().min(1)).min(1),
    category: z.enum(projectCategories),
    status: z.enum(projectStatuses),
    year: z.number().int().min(2000),
    cover: z.string().regex(/^\/projects\/.+\.(png|jpe?g|webp|avif)$/, {
      message: 'cover must be an image path under /projects/, e.g. /projects/<slug>/cover.png',
    }),
    featured: z.boolean().default(false),
    links: z
      .object({
        demo: z.url().optional(),
        repo: z.url().optional(),
        paper: z.url().optional(),
      })
      .optional(),
    order: z.number().int().optional(),
  })
  // Fumadocs (search index, TOC, metadata) reads `description`.
  .transform((data) => ({ ...data, description: data.summary }));

export type ProjectFrontmatter = z.output<typeof projectSchema>;
