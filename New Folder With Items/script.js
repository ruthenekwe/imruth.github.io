/* ══════════════════════════════════════════════════════════════
   RUTH ENEKWE — PORTFOLIO JAVASCRIPT
   Loader · Nav · Scroll Reveal · Hamburger · Form · Scroll-Top
══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Utility: query selector shorthand ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ════════════════════════════════════
   1. LOADER
════════════════════════════════════ */
(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  // Minimum display time so the animation feels intentional
  const MIN_DISPLAY = 1400;
  const start = Date.now();

  function hideLoader() {
    const elapsed = Date.now() - start;
    const delay = Math.max(0, MIN_DISPLAY - elapsed);

    setTimeout(() => {
      loader.classList.add('fade-out');
      // Remove from DOM after transition
      loader.addEventListener('transitionend', () => {
        loader.remove();
        document.body.classList.remove('loading');
      }, { once: true });
    }, delay);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
})();

/* ════════════════════════════════════
   2. DYNAMIC YEAR IN FOOTER
════════════════════════════════════ */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ════════════════════════════════════
   3. NAVBAR — scroll behaviour & active link
════════════════════════════════════ */
(function initNavbar() {
  const navbar  = $('#navbar');
  const links   = $$('.nav-link');
  const sections = $$('section[id]');
  if (!navbar) return;

  // Scrolled class for shadow
  function onScroll() {
    const scrolled = window.scrollY > 24;
    navbar.classList.toggle('scrolled', scrolled);
    updateActiveLink();
    toggleScrollTop();
  }

  // Highlight the nav link whose section is most visible
  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.45) current = sec.id;
    });
    links.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ════════════════════════════════════
   4. HAMBURGER MENU
════════════════════════════════════ */
(function initHamburger() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#nav-links');
  const overlay   = $('#nav-overlay');
  if (!hamburger || !navLinks) return;

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    if (overlay) { overlay.classList.add('visible'); overlay.removeAttribute('aria-hidden'); }
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (overlay) { overlay.classList.remove('visible'); overlay.setAttribute('aria-hidden', 'true'); }
  }

  function toggleMenu() {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on overlay click
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Close when a nav link is clicked (mobile)
  $$('.nav-link', navLinks).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close menu if resized past breakpoint
  const mq = window.matchMedia('(min-width: 821px)');
  mq.addEventListener('change', e => { if (e.matches) closeMenu(); });
})();

/* ════════════════════════════════════
   5. SCROLL REVEAL
════════════════════════════════════ */
(function initScrollReveal() {
  const reveals = $$('.reveal');
  if (!reveals.length) return;

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
})();

/* ════════════════════════════════════
   6. SCROLL TO TOP BUTTON
════════════════════════════════════ */
function toggleScrollTop() {
  const btn = $('#scroll-top');
  if (!btn) return;

  const shouldShow = window.scrollY > 500;
  if (shouldShow) {
    btn.removeAttribute('hidden');
  } else {
    btn.setAttribute('hidden', '');
  }
}

(function initScrollTop() {
  const btn = $('#scroll-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Move focus back to top for accessibility
    const brand = $('.nav-brand');
    if (brand) brand.focus();
  });
})();

/* ════════════════════════════════════
   7. CONTACT FORM
════════════════════════════════════ */
(function initContactForm() {
  const form      = $('#contact-form');
  if (!form) return;

  const submitBtn  = $('#submit-btn');
  const successMsg = $('#form-success');
  const errorMsg   = $('#form-error-msg');

  /* ── Validation helpers ── */
  function getField(id) { return document.getElementById(id); }
  function getError(id)  { return document.getElementById(`${id}-error`); }

  function setError(fieldId, message) {
    const field = getField(fieldId);
    const error = getError(fieldId);
    if (field)  field.classList.add('invalid');
    if (error)  error.textContent = message;
  }

  function clearError(fieldId) {
    const field = getField(fieldId);
    const error = getError(fieldId);
    if (field)  field.classList.remove('invalid');
    if (error)  error.textContent = '';
  }

  function validateName() {
    const val = (getField('name')?.value || '').trim();
    if (!val) { setError('name', 'Please enter your name.'); return false; }
    clearError('name');
    return true;
  }

  function validateEmail() {
    const val = (getField('email')?.value || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) { setError('email', 'Please enter your email address.'); return false; }
    if (!emailRegex.test(val)) { setError('email', 'Please enter a valid email address.'); return false; }
    clearError('email');
    return true;
  }

  function validateMessage() {
    const val = (getField('message')?.value || '').trim();
    if (!val) { setError('message', 'Please enter a message.'); return false; }
    if (val.length < 10) { setError('message', 'Message is too short — please tell me a bit more!'); return false; }
    clearError('message');
    return true;
  }

  /* ── Live validation on blur ── */
  getField('name')?.addEventListener('blur', validateName);
  getField('email')?.addEventListener('blur', validateEmail);
  getField('message')?.addEventListener('blur', validateMessage);

  /* ── Clear error on input ── */
  ['name', 'email', 'message'].forEach(id => {
    getField(id)?.addEventListener('input', () => clearError(id));
  });

  /* ── Submit handler ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Run all validations
    const valid = [validateName(), validateEmail(), validateMessage()].every(Boolean);
    if (!valid) {
      // Focus first invalid field
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    if (successMsg) successMsg.hidden = true;
    if (errorMsg)   errorMsg.hidden = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Success!
        form.reset();
        ['name', 'email', 'message'].forEach(id => clearError(id));
        if (successMsg) { successMsg.hidden = false; successMsg.focus(); }
        // Smooth scroll to success message
        successMsg?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      if (errorMsg) { errorMsg.hidden = false; errorMsg.focus(); }
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
})();

/* ════════════════════════════════════
   8. SMOOTH ANCHOR SCROLL (offset for fixed nav)
════════════════════════════════════ */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;

    window.scrollTo({ top, behavior: 'smooth' });

    // Update URL without triggering scroll
    history.pushState(null, '', anchor.getAttribute('href'));
  });
})();

/* ════════════════════════════════════
   9. PHOTO FALLBACK — if ruth-photo.jpg missing
════════════════════════════════════ */
(function initPhotoFallback() {
  const img = $('.hero-img');
  if (!img) return;

  img.addEventListener('error', () => {
    // Replace with a styled initials placeholder
    const frame = img.closest('.photo-frame');
    if (!frame) return;

    const placeholder = document.createElement('div');
    placeholder.setAttribute('aria-label', 'Ruth Enekwe photo placeholder');
    placeholder.style.cssText = `
      width: 100%;
      aspect-ratio: 3/4;
      background: linear-gradient(135deg, #f8d7e3, #e8daf5);
      border-radius: 44% 32% 44% 32%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Playfair Display', serif;
      font-size: clamp(3rem, 10vw, 5rem);
      color: #c9718e;
      font-style: italic;
      user-select: none;
    `;
    placeholder.textContent = 'RE';
    img.replaceWith(placeholder);
  });
})();
