#!/usr/bin/env node
/**
 * Renders every published surface from `content/profile.json`:
 *
 *   dist/index.html                 the website
 *   dist/github-profile-README.md   README for github.com/TejasPrabhu/TejasPrabhu
 *   dist/linkedin-checklist.md      what to paste into LinkedIn by hand
 *   dist/{sitemap.xml,robots.txt,site.webmanifest}
 *   dist/**                         everything in public/, copied verbatim
 *
 * Node built-ins only — there are no runtime dependencies to install, audit or
 * keep current for a page that is served as static files.
 */

import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { render } from '../src/lib/html.mjs';
import { validate } from '../src/lib/schema.mjs';
import { profileSchema } from '../src/lib/profile-schema.mjs';
import { page } from '../src/templates/page.mjs';
import { readme } from '../src/templates/readme.mjs';
import { linkedinChecklist } from '../src/templates/linkedin.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const from = (...parts) => path.join(root, ...parts);

/* CSS is concatenated in cascade order and inlined rather than minified: the
   whole stylesheet is a few KB gzipped, inlining removes a render-blocking
   request, and shipping it readable keeps "view source" honest. */
const STYLESHEETS = ['tokens.css', 'base.css', 'layout.css', 'print.css'];

async function readAll(dir, files) {
  const parts = await Promise.all(files.map((file) => readFile(from(dir, file), 'utf8')));
  return parts.join('\n');
}

async function loadProfile() {
  const source = await readFile(from('content', 'profile.json'), 'utf8');

  let profile;
  try {
    profile = JSON.parse(source);
  } catch (error) {
    throw new Error(`content/profile.json is not valid JSON: ${error.message}`);
  }

  return validate(profile, profileSchema, 'content/profile.json');
}

function sitemap(profile, lastmod) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${profile.seo.canonical}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '  </url>',
    '</urlset>',
    '',
  ].join('\n');
}

function robots(profile) {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('sitemap.xml', profile.seo.canonical).href}`, ''].join('\n');
}

function manifest(profile) {
  return `${JSON.stringify(
    {
      name: profile.seo.title,
      short_name: profile.identity.name,
      description: profile.seo.description,
      start_url: '/',
      display: 'browser',
      background_color: '#ffffff',
      theme_color: profile.seo.themeColor,
      icons: [
        { src: 'favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  )}\n`;
}

async function report(files) {
  const rows = await Promise.all(
    files.map(async (file) => {
      const { size } = await stat(from('dist', file));
      return `  ${file.padEnd(30)} ${(size / 1024).toFixed(1).padStart(7)} KB`;
    }),
  );
  return rows.join('\n');
}

async function build() {
  const profile = await loadProfile();

  const [css, headScript, siteScript] = await Promise.all([
    readAll('src/styles', STYLESHEETS),
    readFile(from('src/js', 'head.js'), 'utf8'),
    readFile(from('src/js', 'site.js'), 'utf8'),
  ]);

  await rm(from('dist'), { recursive: true, force: true });
  await mkdir(from('dist'), { recursive: true });

  /* public/ first, so a generated file always wins over a stale static one. */
  await cp(from('public'), from('dist'), { recursive: true });

  const lastmod = new Date().toISOString().slice(0, 10);

  await Promise.all([
    writeFile(from('dist', 'index.html'), render(page(profile, { css, headScript, siteScript }))),
    writeFile(from('dist', 'sitemap.xml'), sitemap(profile, lastmod)),
    writeFile(from('dist', 'robots.txt'), robots(profile)),
    writeFile(from('dist', 'site.webmanifest'), manifest(profile)),
    writeFile(from('dist', 'github-profile-README.md'), readme(profile)),
    writeFile(from('dist', 'linkedin-checklist.md'), linkedinChecklist(profile)),
  ]);

  const summary = await report([
    'index.html',
    'github-profile-README.md',
    'linkedin-checklist.md',
    'sitemap.xml',
    'site.webmanifest',
  ]);

  console.log(`Built dist/ from content/profile.json\n${summary}`);
}

build().catch((error) => {
  console.error(`\nBuild failed.\n\n${error.message}\n`);
  process.exitCode = 1;
});
