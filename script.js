/* ===================================================
   HANEESH PORTFOLIO — script.js
   Cinematic Dark Editorial Theme
   Pure Vanilla JavaScript
   =================================================== */

'use strict';

/* ─── UTILITY ─── */
const qs  = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ─── 1. CUSTOM CURSOR ─── */
(function initCursor() {
  const dot   = qs('#cursor');
  const trail = qs('#cursorTrail');
  if (!dot || !trail) return;

  let tx = -100, ty = -100;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    dot.style.left = tx + 'px';
    dot.style.top  = ty + 'px';
  });

  // Trail follows with slight lag via RAF
  let rx = -100, ry = -100;
  function animTrail() {
    rx += (tx - rx) * 0.14;
    ry += (ty - ry) * 0.14;
    trail.style.left = rx + 'px';
    trail.style.top  = ry + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  // Scale on hoverable elements
  const hoverEls = 'a, button, .cert-card, .act-item, .edu-item, .skill-block, .hsc, .soc-lnk, .as-btn, .cl-row';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) {
      dot.style.transform   = 'translate(-50%,-50%) scale(2.5)';
      dot.style.opacity     = '.5';
      trail.style.transform = 'translate(-50%,-50%) scale(1.5)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) {
      dot.style.transform   = 'translate(-50%,-50%) scale(1)';
      dot.style.opacity     = '1';
      trail.style.transform = 'translate(-50%,-50%) scale(1)';
    }
  });
})();

/* ─── 2. NAVBAR: scroll class + active section ─── */
(function initNav() {
  const nav     = qs('#nav');
  const links   = qsa('.nav-lnk[data-sec]');
  const sections = qsa('section[id], div[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);

    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) cur = s.id;
    });
    links.forEach(l => l.classList.toggle('active', l.dataset.sec === cur));
  }, { passive: true });
})();

/* ─── 3. HAMBURGER MOBILE NAV ─── */
(function initBurger() {
  const btn  = qs('#burger');
  const menu = qs('#mobNav');
  if (!btn || !menu) return;

  const close = () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  qsa('.mn-lnk, .mn-resume').forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ─── 4. TYPING EFFECT ─── */
(function initTyping() {
  const el = qs('#typeTarget');
  if (!el) return;

  const words = [
    'Cyber Security Enthusiast',
    'Java Programmer',
    'Python Learner',
    'Problem Solver',
    'Tech Explorer',
    'Network Security Student',
  ];

  let wi = 0, ci = 0, deleting = false;
  const TSPD = 70, DSPD = 35, PAUSE = 2000;

  function tick() {
    const word = words[wi];
    if (deleting) {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 400); return; }
      setTimeout(tick, DSPD);
    } else {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) { setTimeout(() => { deleting = true; tick(); }, PAUSE); return; }
      setTimeout(tick, TSPD);
    }
  }
  setTimeout(tick, 600);
})();

/* ─── 5. SCROLL REVEAL ─── */
(function initReveal() {
  // .ci elements → fade-up
  const ciEls = qsa('.ci');
  const fadeEls = qsa('.reveal-fade');
  const charEls = qsa('.reveal-char');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Staggered child delay inside grids
      const parent = el.parentElement;
      const siblings = qsa('.ci', parent);
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = (idx * 0.08) + 's';

      el.classList.add('in');
      io.unobserve(el);

      // Trigger progress bars inside revealed elements
      qsa('.sbr-fill, .ei-bar-fill, .ec-bar-fill', el).forEach(bar => {
        const w = bar.dataset.w || '0';
        setTimeout(() => { bar.style.width = w + '%'; }, 300);
      });
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  ciEls.forEach(el => io.observe(el));

  // Reveal-fade (hero elements)
  const ioFade = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        ioFade.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12) + 's';
    ioFade.observe(el);
  });

  // Reveal-char (hero name)
  charEls.forEach(el => {
    // Wrap content in span for slide-up effect
    const text = el.textContent;
    el.innerHTML = `<span>${text}</span>`;
    const ioChar = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        el.classList.add('in');
        ioChar.unobserve(el);
      }
    }, { threshold: 0.1 });
    ioChar.observe(el);
  });

  // Trigger hero elements immediately
  setTimeout(() => {
    qsa('.hero-inner .reveal-fade, .hero-photo-wrap.reveal-fade').forEach(el => {
      el.classList.add('in');
    });
    qsa('.reveal-char').forEach(el => el.classList.add('in'));
  }, 200);
})();

/* ─── 6. ANIMATED COUNTERS ─── */
(function initCounters() {
  const els = qsa('[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const div    = parseInt(el.dataset.div || '1', 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      const start  = performance.now();

      function frame(now) {
        const p   = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val  = Math.round(ease * target) / div;
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
})();

/* ─── 7. PROGRESS BARS (standalone trigger) ─── */
(function initBars() {
  const bars = qsa('.sbr-fill, .ei-bar-fill, .ec-bar-fill');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = (bar.dataset.w || '0') + '%';
        io.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => io.observe(b));
})();

/* ─── 8. SMOOTH SCROLL ─── */
qsa('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id  = link.getAttribute('href');
    const target = qs(id);
    if (!target) return;
    e.preventDefault();
    const navH = 70;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
    // Close mobile menu if open
    qs('#mobNav')?.classList.remove('open');
    qs('#burger')?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── 9. PARALLAX ORB (subtle) ─── */
(function initParallax() {
  const orbs = qsa('.hero-orb');
  if (!orbs.length) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs[0] && (orbs[0].style.transform = `translateY(${y * 0.15}px)`);
    orbs[1] && (orbs[1].style.transform = `translateY(${-y * 0.1}px)`);
  }, { passive: true });
})();

/* ─── 10. HOVER: education items glow ─── */
qsa('.edu-item').forEach(item => {
  const dot = qs('.ei-divider', item);
  if (!dot) return;
  item.addEventListener('mouseenter', () => {
    item.style.background = 'rgba(201,168,76,0.02)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.background = '';
  });
});

/* ─── 11. CERT CARD SPOTLIGHT ─── */
qsa('.cert-card, .act-item, .skill-block').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(201,168,76,0.04) 0%, var(--surface) 55%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ─── 12. CERTIFICATE MODAL ─── */
function openCert(src, title) {
  const modal   = qs('#certModal');
  const titleEl = qs('#cmTitle');
  const img     = qs('#cmImg');
  const spinner = qs('#cmSpinner');
  const err     = qs('#cmError');
  if (!modal) return;

  // Reset
  img.classList.remove('loaded');
  img.src = '';
  err.classList.remove('show');
  spinner.classList.remove('hidden');
  titleEl.textContent = title || 'Certificate';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const preload = new Image();
  preload.onload = () => {
    spinner.classList.add('hidden');
    img.src = src;
    img.classList.add('loaded');
  };
  preload.onerror = () => {
    spinner.classList.add('hidden');
    err.classList.add('show');
  };
  preload.src = src;

  setTimeout(() => qs('#cmClose')?.focus(), 100);
}

function closeCert() {
  const modal = qs('#certModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Backdrop click & ESC
qs('#cmBackdrop')?.addEventListener('click', closeCert);
qs('#cmClose')?.addEventListener('click', closeCert);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCert(); });

/* ─── 13. FOOTER YEAR ─── */
const yr = qs('#yr');
if (yr) yr.textContent = new Date().getFullYear();

/* ─── 14. PAUSE MARQUEE ON VISIBILITY CHANGE ─── */
document.addEventListener('visibilitychange', () => {
  const track = qs('.ms-track');
  if (!track) return;
  track.style.animationPlayState = document.hidden ? 'paused' : 'running';
});

/* ─── 15. HERO PHOTO: tilt on mouse move ─── */
(function initPhotoTilt() {
  const frame = qs('.hero-photo-frame');
  if (!frame) return;
  frame.addEventListener('mousemove', e => {
    const rect = frame.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * 6;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * -6;
    frame.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    frame.style.transition = 'transform .1s ease';
  });
  frame.addEventListener('mouseleave', () => {
    frame.style.transform = '';
    frame.style.transition = 'transform .5s ease';
  });
})();

/* ─── 16. STAGGERED HERO ENTRANCE ─── */
(function heroEntrance() {
  const seq = [
    '.hero-eyebrow',
    '.hero-name',
    '.hero-role-row',
    '.hero-tagline',
    '.hero-actions',
    '.hero-social',
    '.hero-stat-cards',
  ];
  seq.forEach((sel, i) => {
    const el = qs(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .7s ease, transform .7s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + i * 120);
  });
})();
