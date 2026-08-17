import { bareUrl, formatMonth, formatRange } from '../lib/format.mjs';

/* The README for the GitHub *profile* repo (TejasPrabhu/TejasPrabhu), rendered
   from the same profile.json as the website — so the two cannot drift.
   Plain string building, not the `html` tagged template: this is Markdown. */

const rule = '\n---\n';

export function readme(profile) {
  const { identity, links } = profile;

  /* The tagline is a compressed restatement of the first summary paragraph, so
     the README takes the paragraphs and the page takes the tagline. */
  const header = [
    `# ${identity.name}`,
    '',
    `**${identity.role}** · ${identity.company} · ${identity.location}`,
    '',
    profile.summary.join('\n\n'),
  ];

  const building = [
    `## ${profile.building.heading}`,
    '',
    ...profile.building.items.map((item) => `- **${item.title}** — ${item.note}`),
    '',
  ];

  const focus = [
    `## ${profile.focus.heading}`,
    '',
    ...profile.focus.items.map((item) => `- **${item.title}** — ${item.note}`),
    '',
  ];

  const outlook = ['## Where I\'m heading', '', profile.outlook, ''];

  /* Title, dates only — no achievement bullets here. Those are LinkedIn's job;
     see linkedin.mjs. A GitHub profile README reads as "what I build and what
     I'm learning," not a résumé restatement. */
  const experience = [
    '## Experience',
    '',
    ...profile.experience.flatMap((entry) => {
      const roleLines = entry.roles.map(
        (role) => `**${role.title}** · ${formatRange(role.start, role.end)}`,
      );
      return [`- [${entry.company}](${entry.url}) · ${entry.location}  `, `  ${roleLines.join(', ')}`];
    }),
    '',
  ];

  const projects = [
    '## Projects',
    '',
    ...profile.projects.flatMap((entry) => [
      `- **[${entry.name}](${entry.repo})** (${entry.year}, ${
        entry.attribution === 'team' ? 'team' : 'solo'
      }) — ${entry.blurb}  `,
      `  \`${entry.stack.join('\` · \`')}\``,
    ]),
    '',
  ];

  const skills = [
    '## Stack',
    '',
    ...profile.skills.map((group) => `**${group.group}** · ${group.items.join(' · ')}  `),
    '',
  ];

  const education = [
    '## Education',
    '',
    ...profile.education.map(
      (entry) =>
        `- **${entry.degree}, ${entry.field}** — ${entry.institution} · ` +
        `${formatMonth(entry.start)} – ${formatMonth(entry.end)}`,
    ),
    '',
  ];

  const certifications = [
    '## Certifications',
    '',
    ...profile.certifications.map(
      (cert) => `- [${cert.code} — ${cert.name.replace('Microsoft Certified: ', '')}](${cert.url})`,
    ),
    '',
  ];

  const publications = profile.publications.length
    ? [
        '## Publications',
        '',
        ...profile.publications.map(
          (item) => `- ${item.url ? `[${item.title}](${item.url})` : item.title} — ${item.note}`,
        ),
        '',
      ]
    : [];

  const contact = [
    '## Elsewhere',
    '',
    `- Website — [${bareUrl(profile.seo.canonical)}](${profile.seo.canonical})`,
    `- LinkedIn — [${bareUrl(links.linkedin)}](${links.linkedin})`,
    `- Email — [${links.email}](mailto:${links.email})`,
    '',
  ];

  return [
    header.join('\n'),
    rule,
    building.join('\n'),
    focus.join('\n'),
    outlook.join('\n'),
    experience.join('\n'),
    projects.join('\n'),
    skills.join('\n'),
    education.join('\n'),
    certifications.join('\n'),
    ...(publications.length ? [publications.join('\n')] : []),
    contact.join('\n'),
    `<sub>Generated from \`content/profile.json\` in [${bareUrl(links.source)}](${links.source}).</sub>\n`,
  ].join('\n');
}
