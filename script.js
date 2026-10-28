/* Portfolio interactions: mobile menu, active nav link, scroll reveal,
   back-to-top, footer year and contact form validation. */
(function () {
  'use strict';
  document.documentElement.classList.add('js'); // enables reveal animation styles

  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  var toTop = document.getElementById('toTop');

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }
  menuBtn.addEventListener('click', function () { setMenu(!navLinks.classList.contains('open')); });
  navLinks.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Scroll: nav border, back-to-top, active link ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var links = navLinks.querySelectorAll('a');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 10);
    toTop.classList.toggle('show', y > 500);

    var current = 'home';
    sections.forEach(function (s) {
      if (y >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(function (a) {
      var active = a.getAttribute('href') === '#' + current;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Scroll reveal ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  var RECIPIENT = 'abiramana1947@gmail.com'; // change if you use another email

  function setError(id, msg) {
    document.getElementById(id + 'Err').textContent = msg;
    document.getElementById(id).parentElement.classList.toggle('invalid', !!msg);
    document.getElementById(id).setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  function validate() {
    var v = {
      name: form.name.value.trim(), email: form.email.value.trim(),
      subject: form.subject.value.trim(), message: form.message.value.trim()
    };
    var ok = true;
    ok = setError('name', v.name.length < 2 ? 'Enter your name (at least 2 characters).' : '') && ok;
    ok = setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? '' : 'Enter a valid email address.') && ok;
    ok = setError('subject', v.subject.length < 3 ? 'Enter a subject (at least 3 characters).' : '') && ok;
    ok = setError('message', v.message.length < 10 ? 'Write a message of at least 10 characters.' : '') && ok;
    return ok ? v : null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    var v = validate();
    if (!v) { status.textContent = ''; return; }

    // No backend: open the visitor's email app with the message filled in.
    // To use a real form service (Formspree, Netlify Forms), replace this block.
    var body = 'Name: ' + v.name + '\nEmail: ' + v.email + '\n\n' + v.message;
    window.location.href = 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(v.subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Opening your email app. Send the message there to complete it.';
    form.reset();
  });
})();
