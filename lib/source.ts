import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema } from 'fumadocs-core/source/schema';
import { projectsRoute } from './shared';
import { projectSchema } from './project-schema';

const projects = defineDocs({
  dir: 'content/projects',
  docs: {
    schema: projectSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: projectsRoute,
  source: projects.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});
