import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const dir = path.join(process.cwd(), 'content', 'projects');

/** Images in MDX with no alt text: `![](src)`, `![  ](src)`, or `<img>`/`<Image>` without a non-empty alt. */
function findImagesWithoutAlt(source: string): string[] {
  const markdown = [...source.matchAll(/!\[\s*\]\(([^)]*)\)/g)].map((match) => match[1]);
  const jsx = [...source.matchAll(/<(?:img|Image)\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => !/\balt=(?:"[^"]*\S[^"]*"|'[^']*\S[^']*'|\{)/.test(tag));
  return [...markdown, ...jsx];
}

describe('findImagesWithoutAlt', () => {
  it('flags markdown and JSX images that lack alt text', () => {
    expect(findImagesWithoutAlt('![](/a.png) ![ok](/b.png) <img src="/c.png" /> <img src="/d.png" alt="D" />')).toEqual(
      ['/a.png', '<img src="/c.png" />'],
    );
  });
});

describe('project content', () => {
  for (const file of readdirSync(dir).filter((name) => name.endsWith('.mdx'))) {
    it(`${file} gives every image alt text`, () => {
      expect(findImagesWithoutAlt(readFileSync(path.join(dir, file), 'utf8'))).toEqual([]);
    });
  }
});
