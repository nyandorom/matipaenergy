/* =========================================================
   Matipa Energy - script.js
   Vanilla JS only. No frameworks. No backend.
   ========================================================= */
(function () {
  'use strict';

  /* ------------------------------------------------------
     1. Sticky-header shadow on scroll
     ------------------------------------------------------ */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------
     2. Mobile nav toggle
     ------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (navToggle && primaryNav) {
    const toggleMobileMenu = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', toggleMobileMenu);
    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------
     3. Hero image slider
     ------------------------------------------------------ */
  const slider = document.getElementById('heroSlider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('slidePrev');
    const nextBtn = document.getElementById('slideNext');
    let currentIndex = 0;
    let timer = null;

    const showSlide = (index) => {
      if (!slides.length) return;
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === currentIndex);
        slide.setAttribute('aria-hidden', String(i !== currentIndex));
      });
      if (dotsWrap) {
        dotsWrap.querySelectorAll('button').forEach((dot, i) => {
          dot.classList.toggle('is-active', i === currentIndex);
          dot.setAttribute('aria-selected', String(i === currentIndex));
        });
      }
    };

    const stopSlider = () => {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const startSlider = () => {
      stopSlider();
      if (slides.length > 1 && !document.hidden) {
        timer = window.setInterval(() => showSlide(currentIndex + 1), 5000);
      }
    };

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Show slide ${i + 1}`);
        dot.addEventListener('click', () => {
          showSlide(i);
          startSlider();
        });
        dotsWrap.appendChild(dot);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentIndex - 1); startSlider(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentIndex + 1); startSlider(); });

    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);
    slider.addEventListener('focusin', stopSlider);
    slider.addEventListener('focusout', startSlider);
    document.addEventListener('visibilitychange', () => document.hidden ? stopSlider() : startSlider());

    showSlide(0);
    startSlider();
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
  revealTargets.forEach((element) => element.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }
})();
