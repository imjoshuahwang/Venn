// ─── INTRO SEQUENCE ───
document.body.style.overflow = 'hidden';
var overlay = document.getElementById('intro-overlay');
var wordmark = document.querySelector('.intro-wordmark');

setTimeout(function () {
  wordmark.classList.add('show');
}, 2600);

setTimeout(function () {
  overlay.style.opacity = '0';
}, 3700);

setTimeout(function () {
  overlay.style.display = 'none';
  document.body.style.overflow = '';
  document.querySelectorAll('.reveal-up').forEach(function (el) {
    el.classList.add('fired');
  });
}, 4650);

// ─── CURSOR GLOW ───
var glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', function (e) {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ─── NAV: SCROLL BORDER + ACTIVE SECTION ───
var nav = document.getElementById('nav');
var navLinks = document.querySelectorAll('.nav-links a[data-section]');
var sections = ['hero', 'how-it-works', 'join'];

window.addEventListener('scroll', function () {
  var scrollY = window.scrollY;

  // Border
  nav.classList.toggle('scrolled', scrollY > 20);

  // Active link
  sections.forEach(function (id) {
    var section = document.getElementById(id);
    if (!section) return;
    var top = section.offsetTop - 120;
    var bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('data-section') === id);
      });
    }
  });

  // ─── VILLAIN LINE PARALLAX ───
  // Moves slower than scroll, creating a "lingering" depth effect from Phamily
  if (villainLine && scrollY < window.innerHeight) {
    villainLine.style.transform = 'translateY(' + (scrollY * 0.22) + 'px)';
  }
}, { passive: true });

// ─── VILLAIN LINE REFERENCE ───
var villainLine = document.querySelector('.villain-line');

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
// From Osmo Supply: when a .stagger-group enters view, each .stagger-line
// child animates in sequentially with 120ms between each element.
var staggerObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    var lines = entry.target.querySelectorAll('.stagger-line');
    lines.forEach(function (line, i) {
      setTimeout(function () {
        line.classList.add('in-view');
      }, i * 130);
    });
    staggerObs.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.stagger-group').forEach(function (el) {
  staggerObs.observe(el);
});

// ─── COUNT ANIMATION ───
function animateCount(el) {
  var target = parseInt(el.getAttribute('data-target'), 10);
  var duration = 2000;
  var start = null;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / duration, 1);
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

// ─── SVG DIAGRAM DRAW-IN ───
// The Warm Intro node (n3) draws in last, then the whole diagram gets
// .diagram-complete which triggers the drop-shadow glow via CSS.
var svgObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    var svg = entry.target;

    var nodes = svg.querySelectorAll('.svg-node');
    var arrows = svg.querySelectorAll('.svg-arrow');
    var heads = svg.querySelectorAll('.svg-head');

    nodes.forEach(function (n, i) {
      setTimeout(function () { n.classList.add('drawn'); }, i * 280);
    });
    arrows.forEach(function (a, i) {
      setTimeout(function () {
        a.classList.add('drawn');
        if (heads[i]) {
          setTimeout(function () { heads[i].classList.add('drawn'); }, 220);
        }
      }, 280 + i * 340);
    });

    // After all elements drawn, add diagram-complete to trigger n3 glow
    // Timing: last arrow head fires at ~280+340+220=840ms, add 300ms buffer
    setTimeout(function () {
      svg.classList.add('diagram-complete');
    }, 1200);

    svgObs.unobserve(entry.target);
  });
}, { threshold: 0.4 });

var processSvg = document.querySelector('.process-svg');
if (processSvg) svgObs.observe(processSvg);

// ─── STEP HOVER: accent line-el ───
document.querySelectorAll('.step').forEach(function (step) {
  var lineEl = step.querySelector('.step-line-el');
  step.addEventListener('mouseenter', function () {
    if (lineEl) lineEl.style.background = 'var(--accent)';
  });
  step.addEventListener('mouseleave', function () {
    if (lineEl) lineEl.style.background = 'var(--divider)';
  });
});

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
        setTimeout(function () {
          exitOverlay.style.opacity = '0';
        }, 320);
      }, 220);
    }
  });
});
