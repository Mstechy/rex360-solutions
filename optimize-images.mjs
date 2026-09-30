/**
 * One-off image optimiser (run with: node optimize-images.mjs)
 *
 * Goals:
 *  - LCP hero: 6000x4000 / 3.7MB  -> 1600px wide WebP + progressive JPEG
 *  - Right-size every public image to the box it is actually displayed in
 *  - Emit WebP (modern format) alongside the originals
 *
 * Existing filenames are preserved so no <img src> breaks; WebP variants are
 * NEW files that the markup opts into.
 */
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const PUB = path.join(process.cwd(), 'public');

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const size = async (f) => {
  try { return (await fs.stat(path.join(PUB, f))).size; } catch { return 0; }
};

/** resize -> webp, return bytes written */
async function toWebp(input, output, width, opts = {}) {
  const tmp = path.join(PUB, output + '.tmp');
  await sharp(path.join(PUB, input))
    .resize({ width, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: opts.quality ?? 76, effort: 5 })
    .toFile(tmp);
  await fs.rename(tmp, path.join(PUB, output));
  return size(output);
}

/** resize in place, keeping format+name */
async function resizeInPlace(file, width, format) {
  const src = path.join(PUB, file);
  const tmp = path.join(PUB, file + '.tmp');
  const img = sharp(src).resize({ width, withoutEnlargement: true, fit: 'inside' });

  if (format === 'jpeg') {
    await img.jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(tmp);
  } else {
    await img.png({ compressionLevel: 9, palette: true }).toFile(tmp);
  }
  await fs.rename(tmp, src);
  return size(file);
}

const report = [];
const log = (label, before, after) =>
  report.push(`  ${label.padEnd(24)} ${String(kb(before)).padStart(10)}  ->  ${String(kb(after)).padStart(9)}`);

/* ── 1. LCP hero ─────────────────────────────────────────────── */
const HERO = 'newsimage.png.jpg';
const heroBefore = await size(HERO);

// Modern format the <link rel=preload> points at:
const heroWebp = await toWebp(HERO, 'newsimage.webp', 1600, { quality: 76 });
// Fallback JPEG (same name NewsPage imports) + <picture> fallback:
const heroJpg = await resizeInPlace(HERO, 1600, 'jpeg');

log('newsimage -> webp', heroBefore, heroWebp);
log('newsimage -> jpeg', heroBefore, heroJpg);

/* ── 2. Logo (displayed ~48px tall in navbar/footer) ─────────── */
const LOGO = 'logo.png';
const logoBefore = await size(LOGO);
const logoJpg = await resizeInPlace(LOGO, 600, 'png');
log('logo.png (2659w)', logoBefore, logoJpg);

/* ── 3. Seal (displayed 128px square) ────────────────────────── */
const OAT = 'oat.png';
const oatBefore = await size(OAT);
const oatOut = await resizeInPlace(OAT, 512, 'png');
log('oat.png (736w)', oatBefore, oatOut);

/* ── 4. Testimonials (shown ~320px wide in a phone frame) ────── */
for (const n of [1, 2, 3, 4, 5]) {
  const f = `testmo${n}.png`;
  const before = await size(f);
  const webp = await toWebp(f, `testmo${n}.webp`, 480, { quality: 78 });
  const png = await resizeInPlace(f, 480, 'png');
  log(`${f} -> webp`, before, webp);
  log(`${f} -> png`, before, png);
}

console.log('\nImage optimisation results:\n' + report.join('\n'));

/* total in public/ */
let total = 0;
for (const f of await fs.readdir(PUB)) {
  const p = path.join(PUB, f);
  if ((await fs.stat(p)).isFile()) total += await size(f);
}
console.log(`\n  TOTAL public/ payload now: ${kb(total)}`);
