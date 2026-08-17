/** Date and text helpers shared by every output format. */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** '2024-09' -> 'Sep 2024'. `null` means "present". */
export function formatMonth(ym) {
  if (!ym) return 'Present';
  const [year, month] = ym.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** '2024-09' -> 'Sep 2024 – Present' */
export function formatRange(start, end) {
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

/** Inclusive month count between two 'YYYY-MM' values; `end` of null means now. */
function monthsBetween(start, end) {
  const [sy, sm] = start.split('-').map(Number);
  const endDate = end ? end.split('-').map(Number) : nowYearMonth();
  const [ey, em] = endDate;
  return (ey - sy) * 12 + (em - sm) + 1;
}

function nowYearMonth() {
  const now = new Date();
  return [now.getUTCFullYear(), now.getUTCMonth() + 1];
}

/** '2 yrs 3 mos', '11 mos', '1 yr'. */
export function formatDuration(start, end) {
  const total = monthsBetween(start, end);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years === 1 ? '' : 's'}`);
  if (months) parts.push(`${months} mo${months === 1 ? '' : 's'}`);
  return parts.join(' ') || '1 mo';
}

/** Earliest start and latest end across a company's roles. */
export function roleSpan(roles) {
  const starts = roles.map((r) => r.start).sort();
  const ends = roles.map((r) => r.end);
  const end = ends.includes(null) ? null : ends.slice().sort().pop();
  return { start: starts[0], end };
}

export function slug(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 'https://github.com/TejasPrabhu/GopherStore' -> 'github.com/TejasPrabhu/GopherStore' */
export function bareUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
