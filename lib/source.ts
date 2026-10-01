import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { defineDocs } from 'fumadocs-mdx/macro';
import { applyMdxPreset } from 'fumadocs-mdx/config';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins/remark-mdx-mermaid';
import { metaSchema } from 'fumadocs-core/source/schema';
import { projectsRoute } from './shared';
import { projectSchema } from './project-schema';
import { compareProjects } from './projects';

const projects = defineDocs({
  dir: 'content/projects',
  docs: {
    schema: projectSchema,
    // Collection-level options replace the defaults, so start from the Fumadocs preset.
    mdxOptions: applyMdxPreset({ remarkPlugins: (plugins) => [...plugins, remarkMdxMermaid] }),
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

/** All projects, sorted by `order`, then newest first. */
export function getProjects() {
  return source.getPages().sort((a, b) => compareProjects(a.data, b.data));
}

/** Page tree with the same ordering as `getProjects()`. */
export function getProjectTree() {
  const tree = source.getPageTree();
  const rank = new Map(getProjects().map((page, index) => [page.url, index]));
  const rankOf = (node: (typeof tree.children)[number]) =>
    node.type === 'page' ? (rank.get(node.url) ?? Number.MAX_SAFE_INTEGER) : Number.MAX_SAFE_INTEGER;

  return { ...tree, children: [...tree.children].sort((a, b) => rankOf(a) - rankOf(b)) };
}
