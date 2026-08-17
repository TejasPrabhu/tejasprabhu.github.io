import { html, raw } from '../lib/html.mjs';
import { bareUrl, formatDuration, formatMonth, formatRange, roleSpan } from '../lib/format.mjs';
import { icons } from './icons.mjs';

/* Projects lead — this is a portfolio, not a résumé. Work history supports it
   with a line per role; the full detail lives on LinkedIn, not here. Order
   here must match the document order of the <section>s below, since the
   scroll-spy in site.js derives its section list from this nav in DOM order. */
const SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'background', label: 'Background' },
  { id: 'contact', label: 'Contact' },
];

const external = { target: '_blank', rel: 'noopener' };
const attrs = (map) =>
  raw(
    Object.entries(map)
      .map(([k, v]) => ` ${k}="${v}"`)
      .join(''),
  );

/* -------------------------------------------------------------------------- */

function sectionHead(id, title, note) {
  return html`
    <div class="section-head">
      <h2 id="${id}-title">${title}</h2>
      ${note ? html`<p class="section-note mono">${note}</p>` : ''}
    </div>
  `;
}

/* One line per role — the full bullet list lives in LinkedIn's `highlights`,
   not here. */
function role(entry) {
  return html`
    <div class="role">
      <h4 class="role-title">${entry.title}</h4>
      <p class="role-dates mono">
        ${formatRange(entry.start, entry.end)}
        <span aria-hidden="true">·</span>
        ${formatDuration(entry.start, entry.end)}
      </p>
      <p class="role-summary">${entry.summary}</p>
    </div>
  `;
}

function company(entry) {
  const span = roleSpan(entry.roles);
  return html`
    <li class="company" data-reveal>
      <div>
        <h3 class="company-name">
          <a href="${entry.url}"${attrs(external)}>${entry.company}</a>
        </h3>
        <div class="company-meta mono">
          <span>${formatRange(span.start, span.end)}</span>
          <span>${entry.location}</span>
        </div>
      </div>
      <div class="roles">${entry.roles.map(role)}</div>
    </li>
  `;
}

function project(entry) {
  return html`
    <li class="project" data-reveal>
      <div class="project-head">
        <h3><a href="${entry.repo}"${attrs(external)}>${entry.name}</a></h3>
        <span class="mono muted">${entry.year}</span>
      </div>
      <p class="project-blurb">${entry.blurb}</p>
      <ul class="tags">
        ${entry.stack.map((tech) => html`<li class="tag mono">${tech}</li>`)}
      </ul>
      <p class="project-foot mono">
        <span>${entry.attribution === 'team' ? 'Team project' : 'Solo project'}</span>
        <span>${icons.arrowUpRight}</span>
      </p>
    </li>
  `;
}

/* -------------------------------------------------------------------------- */

function structuredData(profile, canonical) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.identity.name,
    url: canonical,
    image: new URL(`${profile.identity.photo.base}-640.jpg`, canonical).href,
    jobTitle: profile.identity.role,
    description: profile.seo.description,
    email: `mailto:${profile.links.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Research Triangle Park',
      addressRegion: 'NC',
      addressCountry: 'US',
    },
    worksFor: {
      '@type': 'Organization',
      name: profile.identity.company,
      url: profile.experience[0].url,
    },
    alumniOf: profile.education.map((entry) => ({
      '@type': 'CollegeOrUniversity',
      name: entry.institution,
    })),
    hasCredential: profile.certifications.map((cert) => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert.name,
      credentialCategory: 'certificate',
      url: cert.url,
      recognizedBy: { '@type': 'Organization', name: cert.issuer },
    })),
    knowsAbout: profile.skills.flatMap((group) => group.items),
    sameAs: [profile.links.linkedin, profile.links.github],
  };

  return raw(JSON.stringify(data, null, 2).replace(/</g, '\\u003c'));
}

/* -------------------------------------------------------------------------- */

export function page(profile, { css, headScript, siteScript }) {
  const { identity, links, seo } = profile;
  const canonical = seo.canonical;
  const ogImage = new URL(seo.ogImage, canonical).href;

  return html`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${seo.title}</title>
<meta name="description" content="${seo.description}">
<link rel="canonical" href="${canonical}">

<meta property="og:type" content="profile">
<meta property="og:site_name" content="${identity.name}">
<meta property="og:title" content="${seo.title}">
<meta property="og:description" content="${seo.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${identity.name} — ${identity.role}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${seo.title}">
<meta name="twitter:description" content="${seo.description}">
<meta name="twitter:image" content="${ogImage}">

<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${seo.themeColor}" media="(prefers-color-scheme: dark)">

<link rel="icon" href="favicon/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
<link rel="apple-touch-icon" href="favicon/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">

<script>${raw(headScript)}</script>
<style>${raw(css)}</style>
</head>

<body>
<a class="skip-link" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="#top">${identity.name}</a>
    <nav class="site-nav" aria-label="Sections">
      <ul>
        ${SECTIONS.map((s) => html`<li><a href="#${s.id}">${s.label}</a></li>`)}
      </ul>
    </nav>
    <button class="theme-toggle" type="button" aria-label="Switch theme">
      ${icons.sun}${icons.moon}
    </button>
  </div>
</header>

<main id="main" tabindex="-1">

  <section id="top" class="intro wrap">
    <div class="intro-grid">
      <div>
        <h1>${identity.name}</h1>
        <p class="intro-meta mono">
          ${identity.role}, ${identity.company}
          <span aria-hidden="true">·</span>
          ${identity.location}
        </p>
        <p class="intro-tagline">${identity.tagline}</p>
        <div class="intro-summary prose">
          ${profile.summary.map((para) => html`<p>${para}</p>`)}
        </div>
        <div class="intro-actions">
          <a class="btn btn-primary" href="mailto:${links.email}">${icons.mail} Email me</a>
          <a class="btn" href="${links.linkedin}"${attrs(external)}>${icons.linkedin} LinkedIn</a>
          <a class="btn" href="${links.github}"${attrs(external)}>${icons.github} GitHub</a>
          ${links.resume
            ? html`<a class="btn" href="${links.resume}" download>${icons.download} Résumé</a>`
            : ''}
        </div>
      </div>
      <picture class="intro-photo">
        <source
          type="image/webp"
          srcset="${identity.photo.base}-320.webp 1x, ${identity.photo.base}-640.webp 2x"
        >
        <img
          src="${identity.photo.base}-320.jpg"
          srcset="${identity.photo.base}-640.jpg 2x"
          width="${identity.photo.width}"
          height="${identity.photo.height}"
          alt="${identity.photo.alt}"
          fetchpriority="high"
        >
      </picture>
    </div>
  </section>

  <section id="projects" class="section wrap" aria-labelledby="projects-title">
    ${sectionHead('projects', 'Projects', null)}
    <ul class="projects">
      ${profile.projects.map(project)}
    </ul>
  </section>

  <section id="experience" class="section wrap" aria-labelledby="experience-title">
    ${sectionHead('experience', 'Experience', 'Storage systems, cloud data, developer tooling')}
    <ol class="timeline">
      ${profile.experience.map(company)}
    </ol>
  </section>

  <section id="skills" class="section wrap" aria-labelledby="skills-title">
    ${sectionHead('skills', 'Skills', null)}
    <div class="skills-layout">
      <div class="skill-groups">
        ${profile.skills.map(
          (group) => html`
            <div class="skill-group">
              <h3 class="skill-group-label">${group.group}</h3>
              <ul class="tags">
                ${group.items.map((item) => html`<li class="tag mono">${item}</li>`)}
              </ul>
            </div>
          `,
        )}
      </div>
      <aside class="focus" data-reveal>
        <h3>${profile.focus.heading}</h3>
        <ol>
          ${profile.focus.items.map(
            (item) => html`
              <li>
                <p class="focus-title">${item.title}</p>
                <p class="focus-note">${item.note}</p>
              </li>
            `,
          )}
        </ol>
      </aside>
    </div>
  </section>

  <section id="background" class="section wrap" aria-labelledby="background-title">
    ${sectionHead('background', 'Background', null)}
    <div class="background-layout">
      <div>
        <h3 class="subhead">Education</h3>
        <div class="entries">
          ${profile.education.map(
            (entry) => html`
              <div class="entry">
                <h4 class="entry-title">${entry.institution}</h4>
                <p class="entry-detail">${entry.degree}, ${entry.field}</p>
                <p class="entry-meta mono">
                  ${formatMonth(entry.start)} – ${formatMonth(entry.end)}
                  <span aria-hidden="true">·</span>
                  ${entry.location}
                </p>
              </div>
            `,
          )}
        </div>
      </div>
      <div>
        <h3 class="subhead">Certifications</h3>
        <ul class="cert-list">
          ${profile.certifications.map(
            (cert) => html`
              <li>
                <span class="cert-code mono muted">${cert.code}</span>
                <a class="link-underline" href="${cert.url}"${attrs(external)}
                  >${cert.name.replace('Microsoft Certified: ', '')}</a
                >
              </li>
            `,
          )}
        </ul>
      </div>
    </div>
    ${profile.publications.length
      ? html`
          <div class="publications">
            <h3 class="subhead">Publication</h3>
            ${profile.publications.map(
              (item) => html`
                <p>
                  ${item.url
                    ? html`<a class="link-underline" href="${item.url}"${attrs(external)}
                        >${item.title}</a
                      >`
                    : item.title}
                  <span class="muted">— ${item.note}</span>
                </p>
              `,
            )}
          </div>
        `
      : ''}
  </section>

  <section id="contact" class="section wrap" aria-labelledby="contact-title">
    ${sectionHead('contact', 'Contact', null)}
    <div class="contact-body prose">
      <p>
        I am open to conversations about distributed systems, storage infrastructure and
        developer tooling — including roles, collaboration and the occasional good question.
      </p>
      <p class="contact-email">
        <a class="link-underline mono" href="mailto:${links.email}">${links.email}</a>
        <button
          class="copy-btn"
          type="button"
          data-copy="${links.email}"
          data-copied="false"
          aria-label="Copy email address"
        >
          ${icons.copy}${icons.check}
        </button>
      </p>
      <p class="copy-status visually-hidden" role="status" aria-live="polite"></p>
      <div class="contact-actions">
        <a class="btn" href="${links.linkedin}"${attrs(external)}>${icons.linkedin} LinkedIn</a>
        <a class="btn" href="${links.github}"${attrs(external)}>${icons.github} GitHub</a>
      </div>
    </div>
  </section>

</main>

<footer class="site-footer">
  <div class="wrap footer-inner mono">
    <span>© ${new Date().getFullYear()} ${identity.name}</span>
    <a class="link-underline" href="${links.source}"${attrs(external)}
      >${bareUrl(links.source)}</a
    >
  </div>
</footer>

<script type="application/ld+json">
${structuredData(profile, canonical)}
</script>
<script>${raw(siteScript)}</script>
</body>
</html>
`;
}
