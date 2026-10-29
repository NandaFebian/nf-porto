// Renders each page of the CV PDF to a WebP image plus a manifest, for the in-page CV preview.
// Browsers on Android cannot show a PDF inside an iframe, so the preview uses these images instead.
// Run again whenever the PDF changes: npm run cv:pages
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfPath = path.resolve(process.argv[2] ?? 'public/cv/nanda-febian-cv.pdf');
const dir = path.dirname(pdfPath);
const base = path.basename(pdfPath, '.pdf');
// 2.5x of A4 in points gives about 1490px wide: sharp in full screen, small enough for the image budget.
const SCALE = 2.5;

for (const old of readdirSync(dir).filter((name) => name.startsWith(`${base}-page-`))) {
  rmSync(path.join(dir, old));
}

const standardFontDataUrl = pathToFileURL(path.resolve('node_modules/pdfjs-dist/standard_fonts') + path.sep).href;
const pdf = await getDocument({ data: new Uint8Array(readFileSync(pdfPath)), standardFontDataUrl }).promise;
const pages = [];

for (let number = 1; number <= pdf.numPages; number++) {
  const page = await pdf.getPage(number);
  const viewport = page.getViewport({ scale: SCALE });
  const width = Math.round(viewport.width);
  const height = Math.round(viewport.height);
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  await page.render({ canvas, canvasContext: context, viewport }).promise;

  const file = `${base}-page-${number}.webp`;
  writeFileSync(path.join(dir, file), await canvas.encode('webp', 88));
  pages.push({ src: `/cv/${file}`, width, height });
  console.log(`wrote ${path.join(dir, file)} (${width}x${height})`);
}

writeFileSync(path.join(dir, `${base}.pages.json`), JSON.stringify(pages, null, 2) + '\n');
