// Writes a typographic cover (title, category, year, stack) for each project that has no cover yet.
// Existing files are kept, so a real screenshot dropped in later is never overwritten; pass --force to regenerate.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import React from 'react';

const require = createRequire(import.meta.url);
const { ImageResponse } = require('next/og');

const force = process.argv.includes('--force');
const projectsDir = path.resolve('content/projects');
const WIDTH = 1600;
const HEIGHT = 1000;

// Logo kit palette (public/nf-logo-kit.svg); navy marks the .mdx suffix.
const colors = { paper: '#f4f2ec', ink: '#111214', muted: '#5e5e64', rule: '#dddad0', brand: '#000080' };

/** TTF files from Google Fonts; satori cannot read the woff2 files next/font serves. */
async function loadFont(family, weight) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}`)
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`No TTF found for ${family} ${weight}`);
  return (await fetch(url)).arrayBuffer();
}

function readFrontmatter(file) {
  const block = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const get = (key) => block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim();
  return {
    title: get('title'),
    category: get('category'),
    year: get('year'),
    cover: get('cover'),
    stack: (get('stack') ?? '')
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

const h = React.createElement;

function Cover({ slug, title, category, year, stack }) {
  const key = (label) => h('span', { style: { width: 230, flexShrink: 0, color: colors.muted } }, label);
  return h(
    'div',
    {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '88px 104px',
        background: colors.paper,
        color: colors.ink,
        fontFamily: 'Plex Sans',
      },
    },
    h(
      'div',
      { style: { display: 'flex', fontFamily: 'Plex Mono', fontSize: 34, color: colors.muted } },
      h('span', null, `content/projects/${slug}`),
      h('span', { style: { color: colors.brand } }, '.mdx'),
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          fontSize: title.length > 28 ? 112 : 132,
          fontWeight: 600,
          lineHeight: 1.02,
          letterSpacing: '-0.035em',
          maxWidth: 1300,
        },
      },
      title,
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          paddingTop: 40,
          borderTop: `2px solid ${colors.rule}`,
          fontFamily: 'Plex Mono',
          fontSize: 34,
        },
      },
      h('div', { style: { display: 'flex' } }, key('category'), h('span', null, category)),
      h('div', { style: { display: 'flex' } }, key('year'), h('span', null, year)),
      h('div', { style: { display: 'flex' } }, key('stack'), h('span', { style: { flex: 1 } }, stack.join(' · '))),
    ),
  );
}

const fonts = [
  { name: 'Plex Sans', data: await loadFont('IBM Plex Sans', 600), weight: 600, style: 'normal' },
  { name: 'Plex Mono', data: await loadFont('IBM Plex Mono', 400), weight: 400, style: 'normal' },
];

for (const file of readdirSync(projectsDir).filter((name) => name.endsWith('.mdx'))) {
  const slug = file.replace(/\.mdx$/, '');
  const data = readFrontmatter(path.join(projectsDir, file));
  if (!data.cover || !data.title) {
    console.warn(`skip ${file}: missing title or cover in frontmatter`);
    continue;
  }
  const target = path.join('public', ...data.cover.split('/').filter(Boolean));
  if (existsSync(target) && !force) {
    console.log(`keep ${target}`);
    continue;
  }
  const image = new ImageResponse(h(Cover, { slug, ...data }), { width: WIDTH, height: HEIGHT, fonts });
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, Buffer.from(await image.arrayBuffer()));
  console.log(`wrote ${target}`);
}
