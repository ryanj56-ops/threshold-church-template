/* =====================================================
   Grace Fellowship Church — Demo Template JS
   WranglR Church Website Generator
   ===================================================== */

'use strict';

// ---- Sticky header on scroll ----
const header = document.getElementById('site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Mobile nav toggle ----
const navToggle = document.querySelector('.nav-toggle');
navToggle?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  // Trap scroll when nav open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav when a link is clicked
document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// ---- Scroll reveal animations ----
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Elements to animate on scroll
const revealTargets = document.querySelectorAll(`
  .welcome-grid,
  .services-grid,
  .about-inner,
  .value-card,
  .event-card,
  .sermons-inner,
  .contact-grid,
  .give-inner
`);

revealTargets.forEach((el, i) => {
  el.classList.add('reveal-ready');
  // Stagger children (value cards, event cards)
  if (el.classList.contains('value-card') || el.classList.contains('event-card')) {
    el.style.transitionDelay = `${i * 0.08}s`;
  }
  revealObserver.observe(el);
});

// ---- Visitor form submission ----
const visitorForm = document.querySelector('.visitor-form');
visitorForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = visitorForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  // Disable while "submitting"
  btn.disabled = true;
  btn.textContent = 'Sending...';

  // Simulate async — replace with real n8n webhook in production
  setTimeout(() => {
    btn.textContent = 'Message Sent!';
    btn.style.background = '#2D6A2D';
    visitorForm.querySelectorAll('input, textarea').forEach(field => {
      field.value = '';
    });
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = originalText;
      btn.style.background = '';
    }, 3000);
  }, 1200);
});

// ---- Footer year ----
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Active nav highlight on scroll ----
const sections = document.querySelectorAll('section[id], footer');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));
