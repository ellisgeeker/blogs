// Rasterizes the brand mark into the PNG/ICO files browsers and iOS expect.
// Run `npm run icons` after editing the SVG sources; the outputs are committed.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = (path) => fileURLToPath(new URL(path, import.meta.url));
const app = (path) => fileURLToPath(new URL(`../../src/app/${path}`, import.meta.url));

const small = await readFile(app('icon.svg'));
const large = await readFile(here('apple-icon.svg'));

const png = (svg, size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

// ICO container holding PNG frames (supported by every browser since IE Vista era).
function ico(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  const entries = [];
  let offset = 6 + frames.length * 16;
  for (const { size, data } of frames) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...frames.map((frame) => frame.data)]);
}

const frames = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, data: await png(small, size) })),
);

await writeFile(app('favicon.ico'), ico(frames));
await writeFile(app('apple-icon.png'), await png(large, 180));

console.log('Wrote src/app/favicon.ico (16/32/48) and src/app/apple-icon.png (180)');
