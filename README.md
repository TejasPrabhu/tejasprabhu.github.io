# tejasprabhu.com

Personal site for Tejas Prabhu. Static, hand-written, **no runtime dependencies** — a
~200-line Node script renders every published surface from one content file.

```
content/profile.json  ──▶  dist/index.html                  the website
                      ──▶  dist/github-profile-README.md    README for the GitHub profile repo
                      ──▶  dist/linkedin-checklist.md       what to paste into LinkedIn by hand
                      ──▶  dist/{sitemap.xml,robots.txt,site.webmanifest}
```

## Why it is built this way

The same facts — job titles, dates, metrics, certifications — are published on the website,
on the GitHub profile and on LinkedIn. Keeping three copies in sync by hand does not work;
this repo previously had a different date, a different job title and a different email on
each one. So the content lives in exactly one file, and the surfaces that can be generated
are generated. LinkedIn has no write API, so the build emits a checklist for that one instead.

## Working on it

```bash
npm install     # dev tooling only — the site itself needs nothing
npm run dev     # build, then serve dist/ on http://localhost:4173
```

| Command | What it does |
| --- | --- |
| `npm run build` | Render `dist/` from `content/profile.json` |
| `npm run dev` | Build, then serve `dist/` |
| `npm run check` | Build + validate HTML + check every link |
| `npm run images` | Regenerate the headshot sizes, the OG card and the favicons |

### Editing content

Everything visible on the site comes from [`content/profile.json`](content/profile.json).
Nothing is hardcoded in a template. The file is validated on every build against
[`src/lib/profile-schema.mjs`](src/lib/profile-schema.mjs), so a typo fails the build with the
exact path rather than shipping a broken page:

```
content/profile.json is invalid:
  - experience[0].roles[0].start: expected YYYY-MM, got "Sep 2024"
  - projects[1].attribution: expected one of "solo", "team", got "pair"
```

Dates are always `YYYY-MM`; `end: null` means "present". Durations and date ranges are
computed, so the site, the README and the JSON-LD can never disagree about a date.

### Editing design or behaviour

- `src/styles/tokens.css` — colours, type scale, spacing. Every colour is a token; components
  never use a literal. Light is defined on `:root`, dark is redefined for both
  `prefers-color-scheme` and an explicit `[data-theme="dark"]`.
- `src/styles/{base,layout,print}.css` — elements, components, and the print/CV stylesheet.
- `src/js/head.js` — inline, pre-paint: resolves the theme so there is no flash.
- `src/js/site.js` — under 3 KB: theme toggle, scroll-spy, reveal-on-scroll, copy-email.
  No libraries. Every enhancement degrades to a working page without it.

CSS and JS are inlined into `index.html` at build time — for a single page that removes the
render-blocking requests, and the whole document is a few KB gzipped.

### Images

`npm run images` reads `assets-src/headshot.jpg` and writes the responsive headshot, the
1200×630 Open Graph card (composed from `profile.json`, so it stays in step with the tagline)
and re-compressed favicons. Outputs are committed, so neither the build nor CI ever processes
an image.

## Deploying

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds and publishes `dist/` to GitHub Pages.

> **One-time setup:** Settings → Pages → *Source* must be **GitHub Actions**, not
> "Deploy from a branch". `public/CNAME` carries the custom domain into `dist/`.

[`check.yml`](.github/workflows/check.yml) runs on every push and pull request: schema
validation, HTML validation, and a link check across every repo and credential URL on the
page. Self-referencing `tejasprabhu.com` URLs are skipped — they only resolve after deploy.

## Keeping the other two profiles in sync

After a content change:

1. Copy `dist/github-profile-README.md` over the `README.md` in
   [`TejasPrabhu/TejasPrabhu`](https://github.com/TejasPrabhu/TejasPrabhu).
2. Work through `dist/linkedin-checklist.md`, which lists the exact text for each LinkedIn
   field plus any corrections still outstanding.

## Licence

Code is [MIT](LICENSE). The written content is not.
