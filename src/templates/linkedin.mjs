import { formatMonth, formatRange } from '../lib/format.mjs';

/* LinkedIn has no write API, so consistency there has to be a human step.
   This renders the exact text to paste into each field, plus the specific
   corrections needed to bring the existing profile in line. */

export function linkedinChecklist(profile) {
  const { identity, links } = profile;

  const lines = [
    '# LinkedIn sync checklist',
    '',
    `Generated from \`content/profile.json\`. Paste each block into the matching`,
    'LinkedIn field so the profile, the website and the GitHub profile all agree.',
    '',
    '---',
    '',
    '## Corrections to make first',
    '',
    '- [ ] **Contact email** → `' + links.email + '` (currently `tejas.prabhu29@gmail.com`).',
    '- [ ] **NCICS intern bullet** currently claims a **70%** reduction in processing time,',
    '      while the About summary says **60%**. Change the bullet to **60%** to match.',
    '- [ ] **Add AZ-900 (Azure Fundamentals)** — it is on the GitHub profile but missing here.',
    '- [ ] **Add the website link** to the profile intro: ' + profile.seo.canonical,
    '',
    '---',
    '',
    '## Headline',
    '',
    '```',
    `${identity.role} at ${identity.company} | Full-stack & LLM-powered developer tooling | Enterprise Storage`,
    '```',
    '',
    '## Location',
    '',
    '```',
    identity.location,
    '```',
    '',
    '## About',
    '',
    '```',
    ...profile.summary.flatMap((para, i) => (i ? ['', para] : [para])),
    '',
    `${profile.focus.heading}: ${profile.focus.items.map((f) => f.title).join(', ')}.`,
    '```',
    '',
    '---',
    '',
    '## Experience',
    '',
  ];

  for (const entry of profile.experience) {
    lines.push(`### ${entry.company} — ${entry.location}`, '');
    for (const role of entry.roles) {
      lines.push(
        `**${role.title}** · ${formatRange(role.start, role.end)}`,
        '',
        '```',
        ...role.highlights.map((h) => `• ${h.label}: ${h.text}`),
        '```',
        '',
      );
    }
  }

  lines.push(
    '---',
    '',
    '## Education',
    '',
    ...profile.education.flatMap((entry) => [
      `- **${entry.institution}** — ${entry.degree}, ${entry.field} · ` +
        `${formatMonth(entry.start)} – ${formatMonth(entry.end)}`,
    ]),
    '',
    '## Certifications',
    '',
    ...profile.certifications.map((cert) => `- ${cert.name} (${cert.code}) — ${cert.url}`),
    '',
    '> LinkedIn also lists "Learning R" and "Internet of Things using Raspberry Pi".',
    '> These are course completions rather than certifications and are deliberately',
    '> left off the website and GitHub profile. Keeping them on LinkedIn is fine —',
    '> a superset is not an inconsistency.',
    '',
    '## Top skills (pick 3)',
    '',
    ...profile.skills.slice(0, 3).map((group) => `- ${group.group}: ${group.items.join(', ')}`),
    '',
  );

  return lines.join('\n');
}
