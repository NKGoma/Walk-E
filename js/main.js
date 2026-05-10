'use strict';

// ═══════════════════════════════════════════════
// PARTICLE SYSTEM — Hero background
// ═══════════════════════════════════════════════
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.running = true;
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    for (let i = 0; i < count; i++) {
      this.particles.push(this.makeParticle());
    }
  }

  makeParticle() {
    const isGreen = Math.random() > 0.55;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35 - 0.1,
      opacity: Math.random() * 0.45 + 0.1,
      color: isGreen ? '#00D4A3' : '#7B2FBE',
    };
  }

  animate() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      const alpha = Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
      this.ctx.fillStyle = p.color + alpha;
      this.ctx.fill();
    }
    requestAnimationFrame(() => this.animate());
  }
}

// ═══════════════════════════════════════════════
// CTA PARTICLE SYSTEM — simpler version
// ═══════════════════════════════════════════════
class CTAParticles {
  constructor() {
    this.canvas = document.getElementById('cta-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    const section = document.getElementById('cta');
    if (!section) return;
    this.canvas.width = section.offsetWidth;
    this.canvas.height = section.offsetHeight;
  }

  init() {
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.5 + 0.1),
        opacity: Math.random() * 0.3 + 0.05,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const p of this.particles) {
      p.y += p.speedY;
      if (p.y < 0) p.y = this.canvas.height;
      const alpha = Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = '#00D4A3' + alpha;
      this.ctx.fill();
    }
    requestAnimationFrame(() => this.animate());
  }
}

// ═══════════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════════
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════════════
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  let done = false;

  function update(now) {
    if (done) return;
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('de-DE') + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString('de-DE') + suffix;
      done = true;
    }
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('#hero, #impact').forEach(section => {
    if (section) observer.observe(section);
  });
}

// ═══════════════════════════════════════════════
// NAVBAR SCROLL
// ═══════════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

// ═══════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  menu.addEventListener('click', e => {
    if (e.target.tagName === 'A') menu.classList.remove('open');
  });
}

// ═══════════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ═══════════════════════════════════════════════
// CHALLENGE MAP DOT GRID
// ═══════════════════════════════════════════════
function initChallengeMap() {
  const grid = document.getElementById('challenge-map-grid');
  if (!grid) return;

  const cols = 30;
  const rows = 6;
  const dots = [];

  for (let i = 0; i < cols * rows; i++) {
    const dot = document.createElement('div');
    dot.className = 'map-dot';
    const r = Math.random();
    if (r < 0.55) dot.dataset.state = 'verified';
    else if (r < 0.72) dot.dataset.state = 'pending';
    else dot.dataset.state = 'unmapped';
    grid.appendChild(dot);
    dots.push(dot);
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      dots.forEach((dot, i) => {
        setTimeout(() => {
          dot.className = 'map-dot ' + dot.dataset.state;
        }, i * 18 + Math.random() * 200);
      });
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(grid);
}

// ═══════════════════════════════════════════════
// HEX MAP — Impact section
// ═══════════════════════════════════════════════
function initHexMap() {
  const svg = document.getElementById('hex-map');
  if (!svg) return;

  const R = 26;
  const cols = 11;
  const rows = 8;
  const hexes = [];

  const districts = [
    'Altstadt', 'Maxvorstadt', 'Schwabing', 'Bogenhausen',
    'Isarvorstadt', 'Au', 'Haidhausen', 'Berg am Laim',
    'Neuhausen', 'Nymphenburg', 'Moosach', 'Milbertshofen',
    'Schwabing-West', 'Laim', 'Sendling', 'Obergiesing',
    'Untergiesing', 'Thalkirchen', 'Forstenried', 'Solln',
    'Hadern', 'Pasing', 'Obermenzing', 'Untermenzing',
    'Aubing', 'Lochhausen', 'Allach', 'Karlsfeld',
    'Feldmoching', 'Hasenbergl', 'Ramersdorf', 'Giesing',
  ];

  let dIdx = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * R * Math.sqrt(3) + (row % 2 === 1 ? R * Math.sqrt(3) / 2 : 0) + 35;
      const cy = row * R * 1.5 + 35;

      const pts = [];
      for (let a = 0; a < 6; a++) {
        const angle = (Math.PI / 180) * (60 * a - 30);
        pts.push(`${cx + R * 0.92 * Math.cos(angle)},${cy + R * 0.92 * Math.sin(angle)}`);
      }

      const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      hex.setAttribute('points', pts.join(' '));
      hex.setAttribute('class', 'hex-cell');

      const r = Math.random();
      let state;
      if (r < 0.48) state = 'complete';
      else if (r < 0.7) state = 'filling';
      else state = 'empty';

      hex.dataset.state = state;
      hex.dataset.district = districts[dIdx % districts.length];
      dIdx++;

      applyHexStyle(hex, 'empty');
      svg.appendChild(hex);
      hexes.push(hex);

      // Tooltip on hover
      hex.addEventListener('mouseenter', () => {
        hex.setAttribute('opacity', '0.8');
      });
      hex.addEventListener('mouseleave', () => {
        hex.setAttribute('opacity', '1');
      });
    }
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      hexes.forEach((hex, i) => {
        setTimeout(() => {
          applyHexStyle(hex, hex.dataset.state);
        }, i * 35 + Math.random() * 400);
      });
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(svg);
}

function applyHexStyle(hex, state) {
  if (state === 'complete') {
    hex.setAttribute('fill', 'rgba(0,212,163,0.4)');
    hex.setAttribute('stroke', 'rgba(0,212,163,0.8)');
    hex.setAttribute('stroke-width', '1.5');
  } else if (state === 'filling') {
    hex.setAttribute('fill', 'rgba(255,184,0,0.2)');
    hex.setAttribute('stroke', 'rgba(255,184,0,0.5)');
    hex.setAttribute('stroke-width', '1');
  } else {
    hex.setAttribute('fill', 'rgba(255,255,255,0.03)');
    hex.setAttribute('stroke', 'rgba(255,255,255,0.1)');
    hex.setAttribute('stroke-width', '1');
  }
}

// ═══════════════════════════════════════════════
// GUIDE TABS
// ═══════════════════════════════════════════════
function initGuideTabs() {
  const tabs = document.querySelectorAll('.guide-tab');
  const panels = document.querySelectorAll('.guide-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.guide;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('guide-' + target);
      if (panel) panel.classList.add('active');
    });
  });
}

// ═══════════════════════════════════════════════
// AGE CHIPS — update quote bubble
// ═══════════════════════════════════════════════
function initAgeChips() {
  document.querySelectorAll('.age-chips').forEach(container => {
    const chips = container.querySelectorAll('.chip');
    const panel = container.closest('.guide-panel');
    const bubble = panel ? panel.querySelector('.guide-quote-bubble') : null;

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (bubble && chip.dataset.quote) {
          bubble.style.opacity = '0';
          bubble.style.transform = 'translateY(8px)';
          setTimeout(() => {
            bubble.innerHTML = chip.dataset.quote;
            bubble.style.transition = 'all 0.35s ease';
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
          }, 200);
        }
      });
    });
  });
}

// ═══════════════════════════════════════════════
// AR SIMULATION
// ═══════════════════════════════════════════════
class ARSimulation {
  constructor() {
    this.bbox = document.getElementById('yolo-bbox');
    this.speciesLabel = document.getElementById('species-label');
    this.infoCard = document.getElementById('ar-info-card');
    this.gpsTag = document.getElementById('gps-tag');
    this.dataPacket = document.getElementById('data-packet');
    this.uploadConfirm = document.getElementById('upload-confirm');
    this.detectedCount = document.getElementById('detected-count');
    this.expSteps = [
      document.getElementById('exp-scan'),
      document.getElementById('exp-identify'),
      document.getElementById('exp-tag'),
      document.getElementById('exp-sync'),
    ];

    if (!this.bbox) return;
    this.run();
  }

  setActive(step) {
    this.expSteps.forEach((s, i) => {
      if (s) s.classList.toggle('active', i === step);
    });
  }

  run() {
    this.reset();
    // Phase 1 — scanning
    this.setActive(0);
    if (this.detectedCount) this.detectedCount.textContent = '0';

    setTimeout(() => {
      if (this.detectedCount) this.detectedCount.textContent = '1';
      this.setActive(1);
    }, 1200);

    // Phase 2 — lock on
    setTimeout(() => {
      if (this.bbox) this.bbox.classList.add('locked');
      if (this.speciesLabel) this.speciesLabel.classList.add('visible');
      if (this.detectedCount) this.detectedCount.textContent = '3';
    }, 2000);

    // Phase 3 — info card + GPS
    setTimeout(() => {
      if (this.infoCard) this.infoCard.classList.add('visible');
      if (this.gpsTag) this.gpsTag.classList.add('visible');
      this.setActive(2);
    }, 2800);

    // Phase 4 — data upload
    setTimeout(() => {
      this.setActive(3);
      if (this.dataPacket) {
        this.dataPacket.classList.add('flying');
        setTimeout(() => this.dataPacket.classList.remove('flying'), 1100);
      }
    }, 4200);

    // Confirm
    setTimeout(() => {
      if (this.uploadConfirm) this.uploadConfirm.classList.add('visible');
    }, 5000);

    // Reset and loop
    setTimeout(() => this.run(), 7500);
  }

  reset() {
    if (this.bbox) this.bbox.classList.remove('locked');
    if (this.speciesLabel) this.speciesLabel.classList.remove('visible');
    if (this.infoCard) this.infoCard.classList.remove('visible');
    if (this.gpsTag) this.gpsTag.classList.remove('visible');
    if (this.dataPacket) this.dataPacket.classList.remove('flying');
    if (this.uploadConfirm) this.uploadConfirm.classList.remove('visible');
    this.setActive(0);
  }
}

function initAR() {
  const section = document.getElementById('ar-magic');
  if (!section) return;

  let started = false;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      new ARSimulation();
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(section);
}

// ═══════════════════════════════════════════════
// LEADERBOARD — staggered row reveal + podium
// ═══════════════════════════════════════════════
function initLeaderboard() {
  const table = document.getElementById('leaderboard-table');
  if (!table) return;

  const podiumBlocks = document.querySelectorAll('.podium-block');

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      // Animate rows
      const rows = table.querySelectorAll('.lb-row');
      rows.forEach((row, i) => {
        setTimeout(() => row.classList.add('visible'), i * 90);
      });
      // Animate podium blocks
      podiumBlocks.forEach(block => block.classList.add('animated'));
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(table);
}

// ═══════════════════════════════════════════════
// HERO BUBBLE ROTATION
// ═══════════════════════════════════════════════
function initHeroBubble() {
  const bubbleText = document.getElementById('hero-bubble-text');
  if (!bubbleText) return;

  const messages = [
    '"That oak is 180 years old!<br>Tap to learn more 🌳"',
    '"New data point captured!<br>+250 points earned ⭐"',
    '"Quest unlocked: Find the<br>Linden of Schwabing 🗺️"',
    '"Species: Quercus robur<br>Confidence: 97.3% 🎯"',
    '"You\'re #4 on the Munich<br>leaderboard! Keep going 🏆"',
  ];
  let idx = 0;

  setInterval(() => {
    idx = (idx + 1) % messages.length;
    bubbleText.style.opacity = '0';
    setTimeout(() => {
      bubbleText.innerHTML = messages[idx];
      bubbleText.style.transition = 'opacity 0.4s ease';
      bubbleText.style.opacity = '1';
    }, 350);
  }, 4000);
}

// ═══════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('particle-canvas');
  new CTAParticles();

  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initReveal();
  initCounters();
  initChallengeMap();
  initHexMap();
  initGuideTabs();
  initAgeChips();
  initAR();
  initLeaderboard();
  initHeroBubble();
});
