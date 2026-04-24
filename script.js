// Hero fade-in
setTimeout(function () {
  document.querySelectorAll('.reveal-up').forEach(function (el) {
    el.classList.add('fired');
  });
}, 80);

// Nav border on scroll
var nav = document.getElementById('nav');
window.addEventListener('scroll', function () {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// Cursor glow
var glow = document.getElementById('cursorGlow');
var mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  glow.style.left = mouseX + 'px';
  glow.style.top = mouseY + 'px';
});

// Scroll-reveal via IntersectionObserver
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.scroll-reveal').forEach(function (el) {
  revealObserver.observe(el);
});

// Animated number counter
function animateCount(el) {
  var target = parseInt(el.getAttribute('data-target'), 10);
  var duration = 1800;
  var start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    var progress = Math.min((timestamp - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString();
    }
  }
  requestAnimationFrame(step);
}

var countObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count').forEach(function (el) {
  countObserver.observe(el);
});

// Step hover accent
document.querySelectorAll('.step').forEach(function (step) {
  step.addEventListener('mouseenter', function () {
    var line = step.querySelector('.step-line-el');
    if (line) {
      line.style.background = 'var(--accent)';
      line.style.transition = 'background 0.3s ease';
    }
  });
  step.addEventListener('mouseleave', function () {
    var line = step.querySelector('.step-line-el');
    if (line) {
      line.style.background = 'var(--divider)';
    }
  });
});
