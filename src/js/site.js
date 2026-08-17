/* Everything the page does after paint. No dependencies, no framework.
   Each block is independent — if one selector finds nothing, the rest still run. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- Theme toggle --------------------------------------------------- */

  var toggle = document.querySelector('.theme-toggle');
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function labelFor(theme) {
    return theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  }

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    if (toggle) toggle.setAttribute('aria-label', labelFor(theme));
    if (!persist) return;
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      /* Non-fatal: the choice just will not survive a reload. */
    }
  }

  if (toggle) {
    toggle.setAttribute('aria-label', labelFor(root.dataset.theme));
    toggle.addEventListener('click', function () {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  }

  /* Track the OS until the visitor makes an explicit choice. */
  if (media && media.addEventListener) {
    media.addEventListener('change', function (event) {
      var chosen = null;
      try {
        chosen = localStorage.getItem('theme');
      } catch (e) {
        /* ignore */
      }
      if (!chosen) applyTheme(event.matches ? 'dark' : 'light', false);
    });
  }

  /* ---- Header hairline on scroll -------------------------------------- */

  var header = document.querySelector('.site-header');
  if (header) {
    var syncHeader = function () {
      header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
    };
    window.addEventListener('scroll', syncHeader, { passive: true });
    syncHeader();
  }

  /* ---- Scroll-spy ------------------------------------------------------ */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    var ordered = [];

    navLinks.forEach(function (link) {
      var id = link.hash.slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      byId[id] = link;
      ordered.push(section);
    });

    var onScreen = {};

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          onScreen[entry.target.id] = entry.isIntersecting;
        });

        var active = null;
        for (var i = 0; i < ordered.length; i += 1) {
          if (onScreen[ordered[i].id]) {
            active = ordered[i].id;
            break;
          }
        }

        Object.keys(byId).forEach(function (id) {
          if (id === active) byId[id].setAttribute('aria-current', 'true');
          else byId[id].removeAttribute('aria-current');
        });
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );

    ordered.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---- Reveal on scroll ------------------------------------------------ */

  if (root.classList.contains('js-reveal')) {
    var targets = document.querySelectorAll('[data-reveal]');
    var reveal = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    Array.prototype.forEach.call(targets, function (target) {
      reveal.observe(target);
    });
  }

  /* ---- Copy email ------------------------------------------------------ */

  var copyButton = document.querySelector('.copy-btn');
  var copyStatus = document.querySelector('.copy-status');

  if (copyButton && navigator.clipboard) {
    var resetTimer;
    copyButton.addEventListener('click', function () {
      navigator.clipboard.writeText(copyButton.dataset.copy).then(
        function () {
          copyButton.dataset.copied = 'true';
          if (copyStatus) copyStatus.textContent = 'Email address copied to clipboard';
          clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            copyButton.dataset.copied = 'false';
            if (copyStatus) copyStatus.textContent = '';
          }, 2500);
        },
        function () {
          if (copyStatus) copyStatus.textContent = 'Could not copy — select the address instead';
        },
      );
    });
  } else if (copyButton) {
    copyButton.hidden = true;
  }
})();
