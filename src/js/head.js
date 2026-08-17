/* Runs before first paint, inline in <head>. Two jobs only: resolve the theme
   so there is no flash of the wrong palette, and opt in to progressive
   enhancements that CSS needs to know about up front. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var stored = null;
  try {
    stored = localStorage.getItem('theme');
  } catch (e) {
    /* Storage can be blocked; fall through to the system preference. */
  }

  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light';

  var motionOk = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (motionOk && 'IntersectionObserver' in window) {
    root.classList.add('js-reveal');
  }
})();
