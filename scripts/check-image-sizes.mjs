// Fails when an image in public/ is over the size budget, so a raw screenshot can't slow down LCP unnoticed.
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const LIMIT_KB = Number(process.env.IMAGE_LIMIT_KB ?? 500);
const root = path.resolve('public');
const imageExt = /\.(png|jpe?g|webp|avif|gif)$/i;

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (imageExt.test(entry.name)) yield full;
  }
}

const tooLarge = [...walk(root)]
  .map((file) => ({ file: path.relative(process.cwd(), file), kb: Math.round(statSync(file).size / 1024) }))
  .filter(({ kb }) => kb > LIMIT_KB);

if (tooLarge.length > 0) {
  console.error(`Images over ${LIMIT_KB} KB (compress them or export as WebP/AVIF):`);
  for (const { file, kb } of tooLarge) console.error(`  ${file}: ${kb} KB`);
  process.exit(1);
}
console.log(`All images in public/ are within ${LIMIT_KB} KB.`);
