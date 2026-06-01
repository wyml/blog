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

/* ── 5. 六一儿童节彩蛋 ─────────────────────────────────── */
(function () {
  var now   = new Date();
  var month = now.getMonth() + 1; // 1-based
  var day   = now.getDate();
  if (month !== 6 || day !== 1) return; // 只在 6 月 1 日激活

  var dismissed = sessionStorage.getItem('cd-banner-dismissed');

  /* ─── A. 顶部彩虹横幅 ─── */
  function createBanner() {
    if (dismissed) return;
    var banner = document.createElement('div');
    banner.className = 'childrens-day-banner';
    banner.id = 'cd-banner';
    banner.innerHTML =
      '<span>🎈</span>' +
      '<span>六一儿童节快乐！保持一颗童心，永远年轻 ✨</span>' +
      '<span>🎠</span>' +
      '<button class="cd-close" id="cd-close-btn" aria-label="关闭横幅">✕</button>';
    document.body.prepend(banner);
    document.documentElement.classList.add('cd-banner-active');

    document.getElementById('cd-close-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      banner.style.transition = 'opacity 0.3s, transform 0.3s';
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(-100%)';
      setTimeout(function () {
        banner.remove();
        document.documentElement.classList.remove('cd-banner-active');
      }, 320);
      sessionStorage.setItem('cd-banner-dismissed', '1');
    });
  }

  /* ─── B. Logo 彩虹 ─── */
  function rainbowLogo() {
    var logo = document.querySelector('.site-logo');
    if (logo) logo.classList.add('cd-logo-rainbow');
  }

  /* ─── C. 气球飘起 ─── */
  var BALLOON_COLORS = [
    ['#ff6b9d', '#e84393'], // 粉
    ['#ff9f43', '#ff6b00'], // 橙
    ['#ffd32a', '#f9ca24'], // 黄
    ['#54a0ff', '#2e86de'], // 蓝
    ['#5f27cd', '#341f97'], // 紫
    ['#1dd1a1', '#10ac84'], // 绿青
  ];

  function makeBalloon(colorPair) {
    var c1 = colorPair[0], c2 = colorPair[1];
    var svg =
      '<svg width="52" height="72" viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<ellipse cx="26" cy="26" rx="22" ry="25" fill="' + c1 + '"/>' +
        '<ellipse cx="20" cy="16" rx="7" ry="5" fill="' + c2 + '" opacity="0.35"/>' +
        '<polygon points="22,51 26,58 30,51" fill="' + c2 + '"/>' +
        '<line x1="26" y1="58" x2="26" y2="72" stroke="' + c2 + '" stroke-width="1.5" stroke-dasharray="3 2"/>' +
      '</svg>';
    return svg;
  }

  function spawnBalloon() {
    var container = document.getElementById('cd-balloons');
    if (!container) return;
    var pair    = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    var el      = document.createElement('div');
    el.className = 'balloon';
    el.innerHTML = makeBalloon(pair);
    el.style.left     = (5 + Math.random() * 90) + 'vw';
    var dur           = 7 + Math.random() * 6;
    var swayDur       = (1.5 + Math.random() * 1.5).toFixed(1);
    el.style.animationDuration = dur + 's';
    el.querySelector('svg').style.animationDuration = swayDur + 's';
    el.style.animationDelay    = '0s';

    // 戳破气球
    el.addEventListener('click', function (e) {
      var rect = el.getBoundingClientRect();
      popBalloon(rect.left + rect.width / 2, rect.top + rect.height / 2, pair[0]);
      el.remove();
    });

    container.appendChild(el);
    setTimeout(function () { el.remove(); }, (dur + 1) * 1000);
  }

  function popBalloon(x, y, color) {
    for (var i = 0; i < 8; i++) {
      var p  = document.createElement('div');
      p.className = 'balloon-pop';
      var angle = (i / 8) * 360;
      var dist  = 30 + Math.random() * 40;
      var tx    = Math.cos(angle * Math.PI / 180) * dist;
      var ty    = Math.sin(angle * Math.PI / 180) * dist;
      p.style.cssText =
        'left:' + x + 'px;top:' + y + 'px;' +
        'width:10px;height:10px;border-radius:50%;' +
        'background:' + color + ';' +
        'transform-origin:' + (-tx) + 'px ' + (-ty) + 'px;';
      document.body.appendChild(p);
      setTimeout(function (node) { node.remove(); }, 700, p);
    }
    // 音效字符反馈
    var pop = document.createElement('div');
    pop.className = 'click-star';
    pop.style.left = x + 'px';
    pop.style.top  = y + 'px';
    pop.textContent = '💥';
    document.body.appendChild(pop);
    setTimeout(function () { pop.remove(); }, 900);
  }

  function initBalloons() {
    var container = document.createElement('div');
    container.id = 'cd-balloons';
    document.body.appendChild(container);

    // 立刻飘 3 个，之后每隔 2.5s 一个
    for (var i = 0; i < 3; i++) {
      setTimeout(spawnBalloon, i * 800);
    }
    setInterval(spawnBalloon, 2500);
  }

  /* ─── D. 点击星星彩蛋 ─── */
  var STARS = ['⭐', '✨', '🌟', '💫', '🎉', '🎈', '🌈'];
  function initClickStar() {
    document.addEventListener('click', function (e) {
      // 避免与气球/横幅按钮重复
      if (e.target.closest('#cd-balloons') || e.target.closest('#cd-banner')) return;
      var el = document.createElement('div');
      el.className  = 'click-star';
      el.style.left = e.clientX + 'px';
      el.style.top  = e.clientY + 'px';
      el.textContent = STARS[Math.floor(Math.random() * STARS.length)];
      document.body.appendChild(el);
      setTimeout(function () { el.remove(); }, 900);
    });
  }

  /* ─── E. 彩色纸屑 ─── */
  var CONFETTI_COLORS = ['#ff6b9d','#ff9f43','#ffd32a','#54a0ff','#5f27cd','#1dd1a1','#ff4757'];
  function spawnConfetti() {
    var el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left   = Math.random() * 100 + 'vw';
    el.style.width  = (5 + Math.random() * 6) + 'px';
    el.style.height = (8 + Math.random() * 5) + 'px';
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.opacity = (0.5 + Math.random() * 0.5).toString();
    var dur = 4 + Math.random() * 5;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = Math.random() * 3 + 's';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, (dur + 3.5) * 1000);
  }

  function initConfetti() {
    // 初始撒一批
    for (var i = 0; i < 30; i++) {
      setTimeout(spawnConfetti, i * 100);
    }
    // 之后每隔 1s 补一片
    setInterval(spawnConfetti, 1000);
  }

  /* ─── F. 右下角祝福卡片 ─── */
  function createWishCard() {
    var card = document.createElement('div');
    card.className = 'cd-wish-card';
    card.innerHTML =
      '<div class="cd-wish-emoji">🎠</div>' +
      '<div class="cd-wish-text">六一快乐！<br>保持童心，永远年轻</div>' +
      '<div class="cd-wish-sub">点击气球让它飞走 🎈</div>';
    card.setAttribute('title', '点我消失');
    card.addEventListener('click', function () {
      card.style.transition = 'all 0.3s ease';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.7) translateY(20px)';
      setTimeout(function () { card.remove(); }, 350);
    });
    document.body.appendChild(card);
  }

  /* ─── G. 初始化 ─── */
  function init() {
    createBanner();
    rainbowLogo();
    initBalloons();
    initClickStar();
    initConfetti();
    setTimeout(createWishCard, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
