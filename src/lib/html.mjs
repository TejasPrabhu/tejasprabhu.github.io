/**
 * A tiny escaping template layer.
 *
 * `html` is a tagged template that escapes every interpolated value by default.
 * Values that are already trusted markup (the result of a nested `html` call, or
 * an explicit `raw(...)`) pass through untouched, and arrays are flattened and
 * joined — so building a list is just `items.map(item => html`<li>${item}</li>`)`.
 */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

class Raw {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/** Mark a string as trusted markup that must not be escaped. */
export const raw = (value) => new Raw(value);

function interpolate(value) {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(interpolate).join('');
  return esc(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += interpolate(values[i]) + strings[i + 1];
  }
  return new Raw(out);
}

/** Collapse the whitespace that template literals leave behind, without touching <pre>. */
export function render(node) {
  return String(node).replace(/\n\s*\n+/g, '\n').trimStart();
}
