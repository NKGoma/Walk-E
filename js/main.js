'use strict';

// ═══════════════════════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════════════════════
class ParticleSystem {
  constructor(canvasId, sectionId) {
    this.canvas = document.getElementById(canvasId);
    this.section = sectionId ? document.getElementById(sectionId) : null;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }
  resize() {
    const src = this.section || this.canvas.parentElement;
    this.canvas.width = src ? src.offsetWidth : window.innerWidth;
    this.canvas.height = src ? src.offsetHeight : window.innerHeight;
  }
  init() {
    const count = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 18000));
    for (let i = 0; i < count; i++) this.particles.push(this.make());
  }
  make() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 2.2 + 0.6,
      sx: (Math.random() - 0.5) * 0.35,
      sy: (Math.random() - 0.5) * 0.35 - 0.08,
      opacity: Math.random() * 0.4 + 0.08,
      color: Math.random() > 0.55 ? '#00D4A3' : '#7B2FBE',
    };
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const p of this.particles) {
      p.x += p.sx; p.y += p.sy;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
      const alpha = Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + alpha;
      this.ctx.fill();
    }
    requestAnimationFrame(() => this.animate());
  }
}

// ═══════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') menu.classList.remove('open'); });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const el = document.querySelector(href);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ═══════════════════════════════════════════════
// SCROLL REVEAL + COUNTERS
// ═══════════════════════════════════════════════
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  let done = false;
  function tick(now) {
    if (done) return;
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('de-DE') + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else { el.textContent = target.toLocaleString('de-DE') + suffix; done = true; }
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCounter);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.mission-stat-row, .hero-stats').forEach(el => {
    if (el) observer.observe(el);
  });
}

// ═══════════════════════════════════════════════
// LEGEND CARDS — hover border color
// ═══════════════════════════════════════════════
function initLegendCards() {
  document.querySelectorAll('.legend-card').forEach(card => {
    const color = card.dataset.color || '#00D4A3';
    card.style.setProperty('--card-color', color);
  });
}

// ═══════════════════════════════════════════════
// HERO COMPANION — rotate figure identity
// ═══════════════════════════════════════════════
const COMPANIONS = [
  {
    label: 'Empress Sisi · Royal Munich',
    speech: '"The Hofgarten was my escape. Come, let me show you my Munich."',
    headBg: 'linear-gradient(135deg,#1a6fa8,#c9a227)',
    torsoBg: 'linear-gradient(to bottom,#1a6fa8,rgba(0,212,163,0.7))',
  },
  {
    label: 'Freddie Mercury · Schwabing',
    speech: '"Munich understood me when London didn\'t. Let me show you why."',
    headBg: 'linear-gradient(135deg,#8B1A8B,#FFD700)',
    torsoBg: 'linear-gradient(to bottom,#8B1A8B,rgba(255,215,0,0.5))',
  },
  {
    label: 'Franz Beckenbauer · Giesing',
    speech: '"These streets built me. Every step here is part of my story."',
    headBg: 'linear-gradient(135deg,#DC052D,#fff)',
    torsoBg: 'linear-gradient(to bottom,#DC052D,rgba(255,255,255,0.4))',
  },
  {
    label: 'Werner Heisenberg · LMU',
    speech: '"The more precisely you observe a tree, the more it reveals its uncertainty."',
    headBg: 'linear-gradient(135deg,#0A5C8A,#00D4A3)',
    torsoBg: 'linear-gradient(to bottom,#0A5C8A,rgba(0,212,163,0.7))',
  },
];

function initHeroCompanion() {
  const label = document.getElementById('companion-label');
  const speech = document.getElementById('companion-speech');
  const head = document.querySelector('.companion-head');
  const torso = document.querySelector('.companion-torso');
  if (!label || !speech) return;

  let idx = 0;
  function cycle() {
    idx = (idx + 1) % COMPANIONS.length;
    const c = COMPANIONS[idx];
    // Fade out
    label.style.opacity = '0';
    speech.style.opacity = '0';
    if (head) head.style.opacity = '0';

    setTimeout(() => {
      label.textContent = c.label;
      speech.innerHTML = c.speech;
      if (head) head.style.background = c.headBg;
      if (torso) torso.style.background = c.torsoBg;
      label.style.transition = 'opacity 0.5s ease';
      speech.style.transition = 'opacity 0.5s ease';
      label.style.opacity = '1';
      speech.style.opacity = '1';
      if (head) { head.style.transition = 'all 0.5s ease'; head.style.opacity = '1'; }
    }, 400);
  }
  setInterval(cycle, 5000);
}

// ═══════════════════════════════════════════════
// HERO PHONE TREE TOAST
// ═══════════════════════════════════════════════
const TREE_TOASTS = [
  'Linden · ~140 yrs · logged silently',
  'English Oak · ~95 yrs · logged silently',
  'Plane tree · ~60 yrs · logged silently',
  'Silver Birch · ~45 yrs · logged silently',
  'Horse Chestnut · ~80 yrs · logged silently',
];

function initHeroToast() {
  const toast = document.getElementById('hp-tree-toast');
  if (!toast) return;
  let idx = 0;
  function show() {
    toast.textContent = '';
    toast.innerHTML = `<i class="fa-solid fa-tree"></i> <span>${TREE_TOASTS[idx % TREE_TOASTS.length]}</span>`;
    toast.classList.add('show');
    idx++;
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(show, 6000);
    }, 3000);
  }
  setTimeout(show, 4000);
}

// ═══════════════════════════════════════════════
// CONVERSATION PHONE — figure switching
// ═══════════════════════════════════════════════
const CONV_FIGURES = {
  sisi: {
    name: 'Empress Elisabeth',
    route: 'Royal Munich · Chapter 2 of 5',
    avatarBg: 'linear-gradient(135deg,#1a6fa8,#c9a227)',
    avatarLetter: 'S',
    speakerLabel: 'Sisi is speaking',
    exchanges: [
      { them: '"We\'re passing the Hofgarten gates. I rode here at dawn — before the court could find me, before the day\'s performance began..."' },
      { me: 'Were you truly happy here in Munich?' },
      { them: '"The English Garden gave me what the Hofburg never could. Air. Freedom. No one cared who I was."' },
    ],
    toast: 'Linden · ~140 yrs · logged silently',
  },
  freddie: {
    name: 'Freddie Mercury',
    route: 'Music & Nightlife · Chapter 1 of 4',
    avatarBg: 'linear-gradient(135deg,#8B1A8B,#FFD700)',
    avatarLetter: 'F',
    speakerLabel: 'Freddie is speaking',
    exchanges: [
      { them: '"We\'re near where Musicland Studios used to be. We recorded The Works just around that corner. 1983. The city was electric."' },
      { me: 'Why Munich specifically?' },
      { them: '"London judged. New York rushed. Munich just... let me be. I celebrated my 39th birthday here. This city was home."' },
    ],
    toast: 'Plane tree · ~65 yrs · logged silently',
  },
  beckenbauer: {
    name: 'Franz Beckenbauer',
    route: 'Football & Sport · Chapter 3 of 4',
    avatarBg: 'linear-gradient(135deg,#DC052D,#fff)',
    avatarLetter: 'B',
    speakerLabel: 'Beckenbauer is speaking',
    exchanges: [
      { them: '"Right here — this was the street I played football on as a boy. No academy. No coach. Just this cobblestone and a ball."' },
      { me: 'What made you Der Kaiser?' },
      { them: '"I refused the position I was given. A sweeper who attacks. A defender who scores. Munich taught me to reinvent everything."' },
    ],
    toast: 'Oak · ~90 yrs · logged silently',
  },
  levi: {
    name: 'Levi Strauss',
    route: 'Trade & Migration · Chapter 2 of 3',
    avatarBg: 'linear-gradient(135deg,#4B3728,#c9a227)',
    avatarLetter: 'L',
    speakerLabel: 'Levi is speaking',
    exchanges: [
      { them: '"I was born just 60 kilometres from here, in Buttenheim. My family spoke Bavarian German. I left at 18 with almost nothing."' },
      { me: 'Did you ever miss Bavaria?' },
      { them: '"Every day. You carry your home inside you, wherever you go. The jeans I made in San Francisco — they\'re Bavarian stubbornness in denim."' },
    ],
    toast: 'Chestnut · ~75 yrs · logged silently',
  },
};

class ConversationDemo {
  constructor() {
    this.chips = document.querySelectorAll('.fig-chip');
    this.currentFig = 'sisi';
    this.toastTimer = null;
    this.typeTimer = null;

    if (!this.chips.length) return;
    this.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.switchFigure(chip.dataset.fig);
      });
    });

    this.loadFigure('sisi');
    this.scheduleToast();
    this.scheduleTyping();
  }

  switchFigure(fig) {
    if (fig === this.currentFig) return;
    this.currentFig = fig;
    const screen = document.getElementById('cp-header');
    if (screen) { screen.style.opacity = '0'; screen.style.transition = 'opacity 0.3s'; }
    setTimeout(() => {
      this.loadFigure(fig);
      if (screen) { screen.style.opacity = '1'; }
    }, 300);
  }

  loadFigure(fig) {
    const data = CONV_FIGURES[fig];
    if (!data) return;

    const name = document.getElementById('cp-name');
    const route = document.getElementById('cp-route');
    const avatar = document.getElementById('cp-avatar');
    const speakerLabel = document.getElementById('cp-speaker-label');
    const transcript = document.getElementById('cp-transcript');

    if (name) name.textContent = data.name;
    if (route) route.textContent = data.route;
    if (avatar) {
      avatar.style.background = data.avatarBg;
      avatar.textContent = data.avatarLetter;
    }
    if (speakerLabel) speakerLabel.textContent = data.speakerLabel;

    if (transcript) {
      transcript.innerHTML = '';
      data.exchanges.forEach(ex => {
        const div = document.createElement('div');
        if (ex.them) {
          div.className = 'ct-msg them';
          div.innerHTML = `<span>${ex.them}</span>`;
        } else {
          div.className = 'ct-msg me';
          div.innerHTML = `<span>${ex.me}</span>`;
        }
        transcript.appendChild(div);
      });
      // Add typing indicator
      const typing = document.createElement('div');
      typing.className = 'ct-msg them typing';
      typing.id = 'typing-indicator';
      typing.innerHTML = '<span><div class="typing-dots"><span></span><span></span><span></span></div></span>';
      transcript.appendChild(typing);
    }
  }

  scheduleToast() {
    const toast = document.getElementById('cp-tree-toast');
    const toastText = document.getElementById('tree-toast-text');
    if (!toast) return;
    const show = () => {
      const data = CONV_FIGURES[this.currentFig];
      if (toastText && data) toastText.textContent = data.toast;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        this.toastTimer = setTimeout(show, 9000 + Math.random() * 4000);
      }, 3500);
    };
    this.toastTimer = setTimeout(show, 5000);
  }

  scheduleTyping() {
    const showTyping = () => {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) {
        indicator.style.display = '';
        setTimeout(() => {
          if (indicator) indicator.style.display = 'none';
          setTimeout(showTyping, 6000 + Math.random() * 4000);
        }, 2500);
      } else {
        setTimeout(showTyping, 2000);
      }
    };
    setTimeout(showTyping, 8000);
  }
}

// ═══════════════════════════════════════════════
// 3-WALK CONFIRMATION ANIMATION
// ═══════════════════════════════════════════════
function init3WalkAnimation() {
  const section = document.getElementById('mission');
  if (!section) return;

  const treeConfirmed = document.getElementById('tree-confirmed');
  const confResult = document.getElementById('confirmation-result');

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        if (treeConfirmed) treeConfirmed.classList.add('animated');
      }, 3500);
      setTimeout(() => {
        if (confResult) confResult.classList.add('show');
      }, 4000);
      observer.disconnect();
    }
  }, { threshold: 0.4 });

  observer.observe(section);
}

// ═══════════════════════════════════════════════
// LEADERBOARD ANIMATIONS
// ═══════════════════════════════════════════════
function initLeaderboard() {
  const table = document.getElementById('leaderboard-table');
  const podiumBlocks = document.querySelectorAll('.podium-block');
  if (!table) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      table.querySelectorAll('.lb-row').forEach((row, i) => {
        setTimeout(() => row.classList.add('visible'), i * 90);
      });
      podiumBlocks.forEach(b => b.classList.add('animated'));
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(table);
}

// ═══════════════════════════════════════════════
// CONVERSATION FEATURE HIGHLIGHTS
// ═══════════════════════════════════════════════
function initConvFeatures() {
  const features = document.querySelectorAll('.conv-feature');
  if (!features.length) return;

  let current = 0;
  function cycle() {
    features.forEach(f => f.classList.remove('active'));
    features[current].classList.add('active');
    current = (current + 1) % features.length;
  }
  setInterval(cycle, 3500);
}

// ═══════════════════════════════════════════════
// ANIMATED DEMO — 4-step screencast
// ═══════════════════════════════════════════════
function initDemo() {
  const screen = document.getElementById('demo-screen');
  const captionsEl = document.getElementById('demo-captions');
  const stepsEl = document.getElementById('demo-steps');
  if (!screen) return;

  const states = screen.querySelectorAll('.ds-state');
  const captions = captionsEl ? captionsEl.querySelectorAll('.demo-caption') : [];
  const steps = stepsEl ? stepsEl.querySelectorAll('.demo-step') : [];
  const durations = [3200, 4000, 3800, 3500];

  let current = 0;
  let timer = null;
  let running = false;

  function goTo(idx) {
    states[current].classList.remove('active');
    states[current].classList.add('exit');
    setTimeout(() => states[current].classList.remove('exit'), 500);

    if (captions[current]) captions[current].classList.remove('active');
    if (steps[current]) steps[current].classList.remove('active');

    current = idx;
    states[current].classList.add('active');
    if (captions[current]) captions[current].classList.add('active');
    if (steps[current]) steps[current].classList.add('active');
  }

  function advance() {
    const next = (current + 1) % states.length;
    goTo(next);
    timer = setTimeout(advance, durations[current]);
  }

  // Start when section scrolls into view
  const section = document.getElementById('demo');
  if (!section) return;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !running) {
      running = true;
      timer = setTimeout(advance, durations[0]);
    }
  }, { threshold: 0.3 });
  observer.observe(section);

  // Manual step click
  if (stepsEl) {
    stepsEl.addEventListener('click', e => {
      const step = e.target.closest('.demo-step');
      if (!step) return;
      clearTimeout(timer);
      const idx = parseInt(step.dataset.step, 10);
      goTo(idx);
      timer = setTimeout(advance, durations[current]);
    });
  }
}

// ═══════════════════════════════════════════════
// HERO BEFORE — overlay lift + dot grid
// ═══════════════════════════════════════════════
function initHeroBefore() {
  const overlay = document.getElementById('hero-before');
  if (!overlay) return;

  // Generate dot grid (80 dots, ~23% mapped)
  const grid = document.getElementById('dot-grid');
  if (grid) {
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('span');
      if (Math.random() < 0.23) s.classList.add('mapped');
      grid.appendChild(s);
    }
  }

  // Lift overlay on first scroll
  let lifted = false;
  const lift = () => {
    if (!lifted && window.scrollY > 60) {
      lifted = true;
      overlay.classList.add('lifted');
    }
  };
  window.addEventListener('scroll', lift, { passive: true });
  // Also allow click/tap anywhere on the overlay to lift
  overlay.addEventListener('click', () => {
    if (!lifted) { lifted = true; overlay.classList.add('lifted'); window.scrollTo({ top: 100, behavior: 'smooth' }); }
  });
}

// ═══════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('particle-canvas');
  new ParticleSystem('cta-canvas', 'cta');

  initDemo();
  initHeroBefore();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initReveal();
  initCounters();
  initLegendCards();
  initHeroCompanion();
  initHeroToast();
  new ConversationDemo();
  initConvFeatures();
  init3WalkAnimation();
  initLeaderboard();
});
