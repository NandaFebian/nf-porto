# Nanda Febian portfolio

A personal portfolio in the style of technical documentation: each project has its own docs-like page covering the
problem, role, architecture, stack, challenges, and results. Built with Next.js (App Router) and Fumadocs; content
lives in this repository as MDX and TypeScript, validated with Zod at build time.

## Development

```bash
npm install
cp .env.example .env.local   # optional: only the contact form and site URL need values
npm run dev                  # http://localhost:3000
```

## Content

| What               | Where                              | Notes                                                                    |
| ------------------ | ---------------------------------- | ------------------------------------------------------------------------ |
| Projects           | `content/projects/<slug>.mdx`      | Start from `templates/project.mdx`. The file name is the URL slug.       |
| Project covers     | `public/projects/<slug>/cover.png` | Shown on cards. Keep under 500 KB (checked in CI).                       |
| Skills             | `content/skills.ts`                | Projects using a skill are linked automatically via frontmatter `stack`. |
| Profile, education | `content/profile.ts`               | Values containing `TODO` render as `[pending: ...]`, never as links.     |
| CV                 | `public/cv/nanda-febian-cv.pdf`    | The "Download CV" button appears once the file exists.                   |

A missing or invalid frontmatter field fails the build. Every image in project MDX needs alt text (checked by `npm test`).
Diagrams are written as ` ```mermaid ` code blocks.

## Scripts

| Command                | What it does                                               |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev`          | Development server                                         |
| `npm run build`        | Production build (static pages, plus search and contact)   |
| `npm run lint`         | ESLint                                                     |
| `npm run format`       | Prettier, write changes (`format:check` only checks)       |
| `npm run types:check`  | Route types and `tsc --noEmit`                             |
| `npm test`             | Vitest unit tests (content helpers, schemas, contact)      |
| `npm run test:e2e`     | Playwright against the production build; run `build` first |
| `npm run check:images` | Fails if any image in `public/` is over 500 KB             |

CI (`.github/workflows/ci.yml`) runs all of the checks above on every pull request.

## Environment

See `.env.example`. On Vercel, set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and optionally `CONTACT_FROM_EMAIL` and
the Turnstile keys. The site URL defaults to `https://nandafebian.my.id`; `NEXT_PUBLIC_SITE_URL` overrides it.
Vercel Analytics and Speed Insights load only on Vercel builds.

## Link previews

Every page sets `metadata.openGraph.images` to a 1200x630 PNG rendered at build time by `app/og/[...image]/route.tsx`
(`/og/home.png`, `/og/<page>.png`, `/og/projects/<slug>.png`), using the card in `lib/og-card.tsx`. After a deploy,
paste a URL into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh LinkedIn's cache.
