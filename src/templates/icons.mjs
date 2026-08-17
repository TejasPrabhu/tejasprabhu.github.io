import { raw } from '../lib/html.mjs';

/* Inline SVG, ~2 KB total, replacing the ~1.2 MB of Bootstrap Icons + Font
   Awesome the old page loaded. Every icon is decorative — labels live on the
   element that owns the icon. */

const svg = (body, { viewBox = '0 0 16 16', cls = '' } = {}) =>
  raw(
    `<svg${cls ? ` class="${cls}"` : ''} viewBox="${viewBox}" width="16" height="16" ` +
      `fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ` +
      `stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`,
  );

const filled = (body, { viewBox = '0 0 16 16', cls = '' } = {}) =>
  raw(
    `<svg${cls ? ` class="${cls}"` : ''} viewBox="${viewBox}" width="16" height="16" ` +
      `fill="currentColor" aria-hidden="true" focusable="false">${body}</svg>`,
  );

export const icons = {
  github: filled(
    '<path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 ' +
      '0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 ' +
      '1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 ' +
      '0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 ' +
      '2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 ' +
      '1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 ' +
      '2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>',
  ),
  linkedin: filled(
    '<path d="M12.94 12.94h-2.12V9.61c0-.79-.02-1.81-1.11-1.81-1.11 0-1.28.86-1.28 ' +
      '1.75v3.39H6.31V6.12h2.04v.93h.03c.28-.54.98-1.11 2.01-1.11 2.15 0 2.55 1.42 ' +
      '2.55 3.26v3.74ZM4.01 5.19a1.23 1.23 0 1 1 0-2.46 1.23 1.23 0 0 1 0 2.46Zm1.07 ' +
      '7.75H2.94V6.12h2.14v6.82ZM14 1H2a.98.98 0 0 0-1 .97v12.06c0 .54.45.97 1 ' +
      '.97h12c.55 0 1-.43 1-.97V1.97c0-.54-.45-.97-1-.97Z"/>',
  ),
  mail: svg('<rect x="1.5" y="3" width="13" height="10" rx="1.5"/><path d="m2 4.5 6 4 6-4"/>'),
  copy: svg(
    '<rect x="5.5" y="5.5" width="9" height="9" rx="1.5"/>' +
      '<path d="M10.5 3.5v-1a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h1"/>',
    { cls: 'icon-copy' },
  ),
  check: svg('<path d="m3 8.5 3.5 3.5L13 5"/>', { cls: 'icon-check' }),
  sun: svg(
    '<circle cx="8" cy="8" r="3.25"/><path d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1' +
      'M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06M12.95 12.95l-1.06-1.06M4.11 4.11 3.05 3.05"/>',
    { cls: 'icon-sun' },
  ),
  moon: svg('<path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z"/>', {
    cls: 'icon-moon',
  }),
  arrowUpRight: svg('<path d="M5 11 11 5M6 5h5v5"/>'),
  download: svg('<path d="M8 2v8m0 0 3-3m-3 3L5 7M2.5 12.5h11"/>'),
};
