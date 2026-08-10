/* ============================================================
   AMONA — JavaScript
   Mirrors Mila's interaction patterns
   ============================================================ */

// ── Scroll-Stop Cinematic Zoom ────────────────────────────
(function scrollStop() {
  const section = document.querySelector('.scrollstop');
  if (!section) return;

  const image    = section.querySelector('.scrollstop-image');
  const overlay  = section.querySelector('.scrollstop-overlay');
  const text1    = section.querySelector('.scrollstop-text--1');
  const text2    = section.querySelector('.scrollstop-text--2');
  const text3    = section.querySelector('.scrollstop-text--3');

  let ticking = false;

  function update() {
    const rect     = section.getBoundingClientRect();
    const sectionH = section.offsetHeight;
    const viewH    = window.innerHeight;

    // progress: 0 = just entered, 1 = fully scrolled past
    const scrolled = -rect.top;
    const total    = sectionH - viewH;
    const progress = Math.max(0, Math.min(1, scrolled / total));

    // Image zoom: scale 1 → 1.6
    const scale = 1 + progress * 0.6;
    image.style.transform = `scale(${scale})`;

    // Overlay darkens as we zoom
    const overlayOpacity = 0.2 + progress * 0.35;
    overlay.style.background = `rgba(10,15,28,${overlayOpacity})`;

    // Text panels fade in/out at different progress ranges
    // Text 1: 0.05 → 0.30 (fade in 0.05-0.15, visible 0.15-0.25, fade out 0.25-0.35)
    text1.style.opacity = textOpacity(progress, 0.05, 0.15, 0.25, 0.35);
    // Text 2: 0.35 → 0.60
    text2.style.opacity = textOpacity(progress, 0.35, 0.42, 0.52, 0.62);
    // Text 3: 0.62 → 0.92
    text3.style.opacity = textOpacity(progress, 0.62, 0.70, 0.82, 0.95);

    ticking = false;
  }

  function textOpacity(p, fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd) {
    if (p < fadeInStart) return 0;
    if (p < fadeInEnd)   return (p - fadeInStart) / (fadeInEnd - fadeInStart);
    if (p < fadeOutStart) return 1;
    if (p < fadeOutEnd)  return 1 - (p - fadeOutStart) / (fadeOutEnd - fadeOutStart);
    return 0;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();

// ── Header scroll effect (mirrors Mila) ───────────────────
const header = document.getElementById('siteHeader');

function onScroll() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile menu ───────────────────────────────────────────
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

if (mobileClose && mobileMenu) {
  mobileClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
}

if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ── Scroll reveal (mirrors Mila) ──────────────────────────
const revealEls = document.querySelectorAll(
  '.metric-card, .how-item, .dest-card, .trust-item, .badge-item, .cta-inner, .reveal, .editorial-card, .partner-card, .founder-card'
);

revealEls.forEach(el => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => observer.observe(el));

// ── Report card metric bars animation ─────────────────────
const reportCard = document.querySelector('.report-card');

if (reportCard) {
  const reportObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bars = reportCard.querySelectorAll('.report-metric-bar-fill');
          bars.forEach((bar, i) => {
            const target = bar.dataset.width || '75%';
            setTimeout(() => {
              bar.style.width = target;
            }, 300 + i * 200);
          });
          reportObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  reportObserver.observe(reportCard);
}

// ── Multi-step assessment form ────────────────────────────
const formSteps = document.querySelectorAll('.form-step');
const stepDots = document.querySelectorAll('.step-dot');
const stepLines = document.querySelectorAll('.step-line');
const thankYou = document.querySelector('.form-thankyou');
let currentStep = 0;
const totalSteps = formSteps.length;

function showStep(step) {
  formSteps.forEach((s, i) => {
    s.classList.toggle('active', i === step);
  });

  stepDots.forEach((dot, i) => {
    dot.classList.remove('active', 'completed');
    if (i === step) dot.classList.add('active');
    if (i < step) dot.classList.add('completed');
  });

  stepLines.forEach((line, i) => {
    line.classList.toggle('completed', i < step);
  });
}

// Next buttons
document.querySelectorAll('.btn-step-next').forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep < totalSteps - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });
});

// Back buttons
document.querySelectorAll('.btn-step-back').forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });
});

// Submit
const submitBtn = document.getElementById('submitAssessment');
if (submitBtn) {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    formSteps.forEach(s => s.classList.remove('active'));
    document.querySelector('.steps-indicator').style.display = 'none';
    if (thankYou) thankYou.classList.add('active');
  });
}

// Conditional revenue fields
const rentedRadios = document.querySelectorAll('input[name="currently_rented"]');
const conditionalRevenue = document.getElementById('conditionalRevenue');

rentedRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (conditionalRevenue) {
      conditionalRevenue.style.display = radio.value === 'yes' ? 'grid' : 'none';
    }
  });
});

// ── Smooth scroll for anchor links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ── Card hover effects ────────────────────────────────────
document.querySelectorAll('.metric-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    document.querySelector('#assessment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

console.log('AMONA — loaded successfully');
