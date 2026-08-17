#!/usr/bin/env node
/**
 * Regenerates the published images from `assets-src/` and `content/profile.json`.
 *
 * This is a manual step (`npm run images`), not part of `npm run build` — the
 * outputs are committed, so the deploy path stays dependency-free and CI never
 * needs to process an image. Re-run it when the headshot or the tagline changes.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { esc } from '../src/lib/html.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const from = (...parts) => path.join(root, ...parts);

/* The headshot is a 900x1078 portrait; this window squares it on the face
   without clipping the chin or the shoulders. */
const FACE_CROP = { left: 55, top: 95, width: 800, height: 800 };
const HEADSHOT_SIZES = [320, 640];

const OG = { width: 1200, height: 630 };
const SANS = 'Ubuntu Sans, Inter, Segoe UI, DejaVu Sans, sans-serif';
const MONO = 'Ubuntu Sans Mono, DejaVu Sans Mono, monospace';

async function headshots() {
  const source = sharp(from('assets-src', 'headshot.jpg')).extract(FACE_CROP);
  const written = [];

  for (const size of HEADSHOT_SIZES) {
    const square = source.clone().resize(size, size, { fit: 'cover' });
    const base = from('public', 'img', `headshot-${size}`);

    await square.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${base}.jpg`);
    await square.clone().webp({ quality: 78 }).toFile(`${base}.webp`);

    written.push(`img/headshot-${size}.jpg`, `img/headshot-${size}.webp`);
  }

  return written;
}

async function ogImage(profile) {
  const { identity, seo } = profile;
  const avatar = await sharp(from('assets-src', 'headshot.jpg'))
    .extract(FACE_CROP)
    .resize(260, 260, { fit: 'cover' })
    .composite([
      {
        input: Buffer.from(
          '<svg width="260" height="260"><circle cx="130" cy="130" r="130" fill="#fff"/></svg>',
        ),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  const lines = [
    'Full-stack tooling',
    'Asynchronous Python',
    'Enterprise storage',
  ];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">
  <rect width="${OG.width}" height="${OG.height}" fill="#0b0d10"/>
  <rect x="0" y="0" width="6" height="${OG.height}" fill="#6ea8fe"/>
  <text x="86" y="252" font-family="${SANS}" font-size="82" font-weight="600"
        fill="#e6e9ee" letter-spacing="-2">${esc(identity.name)}</text>
  <text x="88" y="308" font-family="${SANS}" font-size="31" font-weight="400"
        fill="#9aa4b0">${esc(`${identity.role} at ${identity.company}`)}</text>
  ${lines
    .map(
      (line, i) =>
        `<text x="88" y="${392 + i * 40}" font-family="${MONO}" font-size="25" fill="#6ea8fe">` +
        `<tspan fill="#59616b">/</tspan><tspan dx="12">${esc(line)}</tspan></text>`,
    )
    .join('\n  ')}
  <text x="88" y="558" font-family="${MONO}" font-size="23" fill="#59616b">${esc(
    seo.canonical.replace(/^https?:\/\/|\/$/g, ''),
  )}</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .composite([{ input: avatar, left: OG.width - 260 - 96, top: (OG.height - 260) / 2 }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(from('public', 'og-image.png'));

  return ['og-image.png'];
}

async function favicons() {
  const source = from('assets-src', 'headshot.jpg');
  void source; /* Favicons are hand-designed, not derived — only re-compress them. */

  const targets = [
    ['favicon/android-chrome-512x512.png', 512],
    ['favicon/android-chrome-192x192.png', 192],
    ['favicon/apple-touch-icon.png', 180],
  ];

  const written = [];
  for (const [file, size] of targets) {
    const input = await readFile(from('public', file));
    const output = await sharp(input)
      .resize(size, size, { fit: 'cover' })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();

    if (output.length < input.length) {
      await writeFile(from('public', file), output);
      written.push(`${file} (${(input.length / 1024).toFixed(0)} KB → ${(output.length / 1024).toFixed(0)} KB)`);
    }
  }
  return written;
}

async function main() {
  await mkdir(from('public', 'img'), { recursive: true });
  const profile = JSON.parse(await readFile(from('content', 'profile.json'), 'utf8'));

  const written = [
    ...(await headshots()),
    ...(await ogImage(profile)),
    ...(await favicons()),
  ];

  console.log(`Wrote ${written.length} image(s):\n${written.map((f) => `  ${f}`).join('\n')}`);
}

main().catch((error) => {
  console.error(`\nImage generation failed.\n\n${error.stack}\n`);
  process.exitCode = 1;
});
