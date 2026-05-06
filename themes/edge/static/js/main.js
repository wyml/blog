/* ============================================================
   Edge Theme — main.js
   - Theme toggle (dark/light) with localStorage + system pref
   - Reading progress bar
   - Post card entrance animation
   - Active nav link detection
   ============================================================ */

/* ── 1. Theme Toggle ─────────────────────────────────────── */
(function () {
  var STORAGE_KEY = 'edge-theme';
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function setTheme(theme) {
    // Temporarily disable transitions for instant switch
    document.body.classList.add('no-transition');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Re-enable transitions after one frame
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.remove('no-transition');
      });
    });

    btn.setAttribute('aria-label', theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
    btn.setAttribute('title',      theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
  }

  // Apply initial button label
  setTheme(getTheme());

  btn.addEventListener('click', function () {
    var current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Keyboard shortcut: Alt+T
  document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key.toLowerCase() === 't') {
      e.preventDefault();
      var current = getTheme();
      setTheme(current === 'dark' ? 'light' : 'dark');
    }
  });

  // Follow OS theme change if user hasn't manually set one
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
})();

/* ── 2. Reading Progress Bar ─────────────────────────────── */
(function () {
  var bar = document.querySelector('.reading-progress');
  if (!bar) return;

  function update() {
    var scrollTop  = window.scrollY;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(progress, 100) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── 3. Post Card Entrance Animation ─────────────────────── */
(function () {
  if (!window.IntersectionObserver) return;

  // Respect reduced motion preference
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var cards = document.querySelectorAll('.post-card');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  cards.forEach(function (card, i) {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(20px)';
    card.style.transition = [
      'opacity 0.4s ease ' + (i * 0.07) + 's',
      'transform 0.4s ease ' + (i * 0.07) + 's',
      'border-color 0.15s ease'
    ].join(', ');
    observer.observe(card);
  });
})();

/* ── 4. Active Nav Link ───────────────────────────────────── */
(function () {
  // Hugo already sets aria-current="page" via templates.
  // This is a JS fallback for any edge cases.
  var path  = window.location.pathname;
  var links = document.querySelectorAll('.nav-links a');
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && path === href) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
