/**
 * A ~90-line structural validator for `content/profile.json`.
 *
 * The point is not generality — it is that a typo in the content file fails the
 * build with an exact JSON path (`experience[0].roles[1].start: expected YYYY-MM,
 * got "Jul 2019"`) instead of rendering a broken page.
 */

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const check = (name, test) => ({ kind: 'scalar', name, test });

export const str = check('string', (v) => typeof v === 'string' && v.length > 0);
export const num = check('number', (v) => typeof v === 'number' && Number.isFinite(v));
export const ym = check('YYYY-MM', (v) => typeof v === 'string' && YEAR_MONTH.test(v));
export const url = check('URL', (v) => typeof v === 'string' && /^https?:\/\/\S+$/.test(v));
export const email = check('email address', (v) => typeof v === 'string' && EMAIL.test(v));
export const oneOf = (...allowed) =>
  check(`one of ${allowed.map((a) => JSON.stringify(a)).join(', ')}`, (v) => allowed.includes(v));

/** Accepts the inner type, or `null`. */
export const nullable = (inner) => ({ kind: 'nullable', inner });
/** The key may be absent entirely. */
export const optional = (inner) => ({ kind: 'optional', inner });
export const arrayOf = (inner, { min = 1 } = {}) => ({ kind: 'array', inner, min });
export const object = (shape) => ({ kind: 'object', shape });

function walk(value, type, path, errors) {
  if (type.kind === 'optional') {
    if (value === undefined) return;
    walk(value, type.inner, path, errors);
    return;
  }
  if (type.kind === 'nullable') {
    if (value === null) return;
    walk(value, type.inner, path, errors);
    return;
  }
  if (value === undefined) {
    errors.push(`${path}: missing (expected ${describe(type)})`);
    return;
  }
  if (type.kind === 'scalar') {
    if (!type.test(value)) {
      errors.push(`${path}: expected ${type.name}, got ${JSON.stringify(value)}`);
    }
    return;
  }
  if (type.kind === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${path}: expected an array, got ${typeof value}`);
      return;
    }
    if (value.length < type.min) {
      errors.push(`${path}: expected at least ${type.min} item(s), got ${value.length}`);
    }
    value.forEach((item, i) => walk(item, type.inner, `${path}[${i}]`, errors));
    return;
  }
  if (type.kind === 'object') {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      errors.push(`${path}: expected an object, got ${Array.isArray(value) ? 'array' : typeof value}`);
      return;
    }
    for (const [key, inner] of Object.entries(type.shape)) {
      walk(value[key], inner, path ? `${path}.${key}` : key, errors);
    }
    for (const key of Object.keys(value)) {
      if (!(key in type.shape)) errors.push(`${path ? `${path}.` : ''}${key}: unknown key`);
    }
  }
}

function describe(type) {
  if (type.kind === 'scalar') return type.name;
  if (type.kind === 'array') return 'an array';
  if (type.kind === 'object') return 'an object';
  return type.kind;
}

/** Throws an AggregateError-style message listing every problem at once. */
export function validate(value, type, label = 'profile.json') {
  const errors = [];
  walk(value, type, '', errors);
  if (errors.length) {
    throw new Error(`${label} is invalid:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  }
  return value;
}
