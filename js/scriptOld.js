/* =========================================================
   Matipa Energy — script.js
   Vanilla JS only. No frameworks. No backend.
   ========================================================= */

(function () {
  'use strict';

  /* ------------------------------------------------------
     1. Sticky-header shadow on scroll
  ------------------------------------------------------ */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------
     2. Mobile nav toggle
  ------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close menu after tapping a link (mobile UX)
    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('is-open')) {
          primaryNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ------------------------------------------------------
     3. Hero image slider
        - Auto-slides every 5s with smooth fade
        - Manual prev/next arrows + dots
        - Pauses on hover, when tab hidden, or while interacting
  ------------------------------------------------------ */
  const slider = document.getElementById('heroSlider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('slidePrev');
    const nextBtn = document.getElementById('slideNext');

    let current = slides.findIndex((s) => s.classList.contains('is-active'));
    if (current < 0) current = 0;

    const INTERVAL = 5000; // 5 seconds per slide
    let timer = null;
    let paused = false;

    // Build dots
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === current) b.classList.add('is-active');
      b.addEventListener('click', () => goTo(i, true));
      dotsWrap && dotsWrap.appendChild(b);
      return b;
    });

    function goTo(index, userTriggered) {
      if (index === current) return;
      slides[current].classList.remove('is-active');
      dots[current] && dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current] && dots[current].classList.add('is-active');
      if (userTriggered) restartTimer();
    }
    function next() { goTo(current + 1, false); }
    function prev() { goTo(current - 1, false); }

    function startTimer() {
      stopTimer();
      if (paused) return;
      timer = window.setInterval(next, INTERVAL);
    }
    function stopTimer() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function restartTimer() { stopTimer(); startTimer(); }

    prevBtn && prevBtn.addEventListener('click', () => { prev(); restartTimer(); });
    nextBtn && nextBtn.addEventListener('click', () => { next(); restartTimer(); });

    // Keyboard support
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { prev(); restartTimer(); }
      if (e.key === 'ArrowRight') { next(); restartTimer(); }
    });

    // Pause on hover (desktop)
    slider.addEventListener('mouseenter', () => { paused = true;  stopTimer(); });
    slider.addEventListener('mouseleave', () => { paused = false; startTimer(); });

    // Pause when the tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopTimer();
      else startTimer();
    });

    // Touch swipe support (mobile)
    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const dx = touchEndX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next(); else prev();
        restartTimer();
      }
    }, { passive: true });

    // Kick off
    startTimer();
  }

  /* ------------------------------------------------------
     4. Footer year
  ------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------
     5. Scroll-triggered reveal animation
  ------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    '.section-head, .service-card, .why-item, .gallery-item, .about-media, .about-copy, .cta-wrap'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    // Fallback: just show them
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }
})();
