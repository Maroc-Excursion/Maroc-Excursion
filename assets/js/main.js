/* ============================================================
   MAROC EXCURSION — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Hero Slider ---- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0, timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startAuto() { timer = setInterval(() => goTo(current + 1), 5500); }
  function stopAuto()  { clearInterval(timer); }

  if (slides.length) {
    startAuto();
    document.querySelector('.hero-arrow.next')
      ?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    document.querySelector('.hero-arrow.prev')
      ?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));
  }

  /* ---- Sticky header shadow ---- */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header && header.classList.toggle('scrolled', window.scrollY > 60);
    updateBackToTop();
  }, { passive: true });

  /* ---- Cards Slider ---- */
  function initCardsSlider(trackId, prevId, nextId) {
    const track    = document.querySelector(trackId);
    const prevBtn  = document.querySelector(prevId);
    const nextBtn  = document.querySelector(nextId);
    if (!track) return;

    let idx = 0;
    function getVisible() { return window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3; }
    function getTotal()   { return track.children.length; }
    function clamp(v)     { return Math.max(0, Math.min(v, getTotal() - getVisible())); }

    function update() {
      const gap  = 24;
      const card = track.children[0];
      if (!card) return;
      const w = card.offsetWidth + gap;
      track.style.transform = `translateX(-${idx * w}px)`;
    }

    prevBtn?.addEventListener('click', () => { idx = clamp(idx - 1); update(); });
    nextBtn?.addEventListener('click', () => { idx = clamp(idx + 1); update(); });
    window.addEventListener('resize', () => { idx = clamp(idx); update(); }, { passive: true });
  }

  initCardsSlider('#excursionsTrack', '#excPrev', '#excNext');
  initCardsSlider('#transfersTrack', '#trfPrev', '#trfNext');

  /* ---- Search Tabs ---- */
  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ---- Mobile Nav ---- */
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  });
  mobileClose?.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  });

  /* ---- Back to Top ---- */
  const btt = document.querySelector('.back-to-top');
  function updateBackToTop() {
    btt && btt.classList.toggle('visible', window.scrollY > 500);
  }
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- Scroll-reveal (simple AOS-like) ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('aos-animate'), (e.target.dataset.delay || 0) * 1);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

  /* ---- CountUp stats ---- */
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const dur    = 2000;
    const step   = 16;
    const inc    = target / (dur / step);
    let current  = 0;
    const t = setInterval(() => {
      current = Math.min(current + inc, target);
      el.textContent = Math.floor(current).toLocaleString() + suffix;
      if (current >= target) clearInterval(t);
    }, step);
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-count]').forEach(el => countUp(el));
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelector('.stats-grid') && statsObs.observe(document.querySelector('.stats-grid'));

  /* ---- Wishlist heart toggle ---- */
  document.querySelectorAll('.card-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      if (icon.classList.contains('far')) {
        icon.classList.replace('far', 'fas');
        btn.style.color = '#E53935';
        btn.style.borderColor = '#E53935';
      } else {
        icon.classList.replace('fas', 'far');
        btn.style.color = '';
        btn.style.borderColor = '';
      }
    });
  });

  /* ---- Smooth dropdown on mobile sub items ---- */
  document.querySelectorAll('.mobile-sub-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const sub = toggle.nextElementSibling;
      if (sub) sub.style.display = sub.style.display === 'none' ? 'block' : 'none';
    });
  });

})();
