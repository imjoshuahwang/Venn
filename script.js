// ─── INTRO SEQUENCE ───
// Total runtime 2.8s: circles draw → wordmark fades in → overlay fades → clears
document.body.style.overflow = 'hidden';
var overlay  = document.getElementById('intro-overlay');
var wordmark = document.querySelector('.intro-wordmark');

// Wordmark appears at 1.8s (after circles have drawn)
setTimeout(function () { wordmark.classList.add('show'); }, 1800);

// Overlay starts fading at 2.2s
setTimeout(function () { overlay.style.opacity = '0'; }, 2200);

// At 2.8s: hide overlay, restore scroll, fire hero text reveals
setTimeout(function () {
  overlay.style.display = 'none';
  document.body.style.overflow = '';
  document.querySelectorAll('.reveal-up').forEach(function (el) {
    el.classList.add('fired');
  });
}, 2800);

// ─── CURSOR GLOW ───
var glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', function (e) {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ─── NAV: SCROLL BORDER + ACTIVE SECTION ───
var nav      = document.getElementById('nav');
var navLinks = document.querySelectorAll('.nav-links a[data-section]');
var sections = ['hero', 'how-it-works', 'join'];

window.addEventListener('scroll', function () {
  var scrollY = window.scrollY;
  nav.classList.toggle('scrolled', scrollY > 20);
  sections.forEach(function (id) {
    var section = document.getElementById(id);
    if (!section) return;
    var top    = section.offsetTop - 120;
    var bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('data-section') === id);
      });
    }
  });
}, { passive: true });

// ─── SCROLL REVEAL ───
var revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.scroll-reveal').forEach(function (el) {
  revealObs.observe(el);
});

// ─── STAGGER REVEAL ───
var staggerObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    var lines = entry.target.querySelectorAll('.stagger-line');
    lines.forEach(function (line, i) {
      setTimeout(function () { line.classList.add('in-view'); }, i * 130);
    });
    staggerObs.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.stagger-group').forEach(function (el) {
  staggerObs.observe(el);
});

// ─── COUNT ANIMATION ───
function animateCount(el) {
  var target   = parseInt(el.getAttribute('data-target'), 10);
  var duration = 2000;
  var start    = null;
  function step(ts) {
    if (!start) start = ts;
    var p     = Math.min((ts - start) / duration, 1);
    var eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (p < 1) { requestAnimationFrame(step); }
    else { el.textContent = target.toLocaleString(); }
  }
  requestAnimationFrame(step);
}

var countObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count').forEach(function (el) {
  countObs.observe(el);
});

// ─── TIMELINE: activate items + grow track fill ───
var tlItems = document.querySelectorAll('.tl-item');
var tlFill  = document.getElementById('tlFill');

function updateTrackFill() {
  if (!tlFill) return;
  var activeItems = document.querySelectorAll('.tl-item.tl-active');
  if (!activeItems.length) { tlFill.style.height = '0'; return; }
  var lastDot  = activeItems[activeItems.length - 1].querySelector('.tl-dot');
  var track    = tlFill.parentElement;
  if (!lastDot || !track) return;
  var dotTop   = lastDot.getBoundingClientRect().top + window.scrollY;
  var trackTop = track.getBoundingClientRect().top  + window.scrollY;
  tlFill.style.height = Math.max(0, dotTop - trackTop + 5) + 'px';
}

var tlObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('tl-active');
      updateTrackFill();
    }
  });
}, { threshold: 0.25 });

tlItems.forEach(function (item) { tlObs.observe(item); });

// ─── EXIT FADE ON EXTERNAL LINKS ───
var exitOverlay = document.getElementById('exit-overlay');
document.querySelectorAll('.ext-link').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('http')) {
      e.preventDefault();
      exitOverlay.style.opacity = '1';
      setTimeout(function () {
        window.open(href, '_blank');
        setTimeout(function () { exitOverlay.style.opacity = '0'; }, 320);
      }, 220);
    }
  });
});
