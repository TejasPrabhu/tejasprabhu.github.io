import {
  arrayOf, email, nullable, num, object, oneOf, optional, str, url, ym,
} from './schema.mjs';

const highlight = object({
  label: str,
  text: str,
});

/* Shared by `focus` and `building` — a titled one-liner with a supporting note. */
const noteItem = object({ title: str, note: str });

const role = object({
  title: str,
  start: ym,
  end: nullable(ym),
  /* One line, shown on the website. Full detail lives in `highlights`, which
     only the LinkedIn checklist renders. */
  summary: str,
  highlights: arrayOf(highlight),
});

export const profileSchema = object({
  identity: object({
    name: str,
    role: str,
    company: str,
    location: str,
    tagline: str,
    photo: object({
      /* `${base}-320.{jpg,webp}` and `${base}-640.{jpg,webp}`, produced by
         `npm run images`. */
      base: str,
      width: num,
      height: num,
      alt: str,
    }),
  }),

  links: object({
    email,
    linkedin: url,
    github: url,
    source: url,
    resume: nullable(str),
  }),

  summary: arrayOf(str),

  focus: object({
    heading: str,
    items: arrayOf(noteItem),
  }),

  /* GitHub-profile-README-only content: no per-role achievement bullets there,
     just a present-tense "what I build" statement. */
  building: object({
    heading: str,
    items: arrayOf(noteItem),
  }),

  outlook: str,

  experience: arrayOf(
    object({
      company: str,
      shortName: optional(str),
      location: str,
      url: url,
      roles: arrayOf(role),
    }),
  ),

  projects: arrayOf(
    object({
      name: str,
      repo: url,
      year: num,
      attribution: oneOf('solo', 'team'),
      blurb: str,
      stack: arrayOf(str),
    }),
  ),

  skills: arrayOf(object({ group: str, items: arrayOf(str) })),

  education: arrayOf(
    object({
      institution: str,
      degree: str,
      field: str,
      start: ym,
      end: ym,
      location: str,
    }),
  ),

  certifications: arrayOf(
    object({ code: str, name: str, issuer: str, url: url }),
  ),

  publications: arrayOf(
    object({ title: str, note: str, url: nullable(url) }),
  ),

  seo: object({
    canonical: url,
    title: str,
    description: str,
    ogImage: str,
    themeColor: str,
  }),
});
