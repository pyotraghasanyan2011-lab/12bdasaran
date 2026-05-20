// =============================================
// PARTICLES
// =============================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : H + 10;
    this.size = Math.random() * 1.5 + 0.4;
    this.speedY = -(Math.random() * 0.4 + 0.1);
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.opacity = 0;
    this.maxOpacity = Math.random() * 0.45 + 0.1;
    this.phase = Math.random() * Math.PI * 2;
    this.fadeIn = true;
  }

  update() {
    this.phase += 0.01;
    this.x += this.speedX + Math.sin(this.phase) * 0.15;
    this.y += this.speedY;

    if (this.fadeIn) {
      this.opacity += 0.005;
      if (this.opacity >= this.maxOpacity) this.fadeIn = false;
    } else if (this.y < H * 0.3) {
      this.opacity -= 0.004;
    }

    if (this.y < -10 || this.opacity <= 0) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,168,76,${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// =============================================
// HERO CLICK → SCROLL
// =============================================
const hero = document.getElementById('hero');
hero.addEventListener('click', () => {
  const school = document.getElementById('school');
  school.scrollIntoView({ behavior: 'smooth' });
});

// =============================================
// PARALLAX
// =============================================
const parallaxBgs = document.querySelectorAll('.parallax-bg');
const parallaxImg = document.querySelector('.parallax-img');

function onScroll() {
  const scrollY = window.scrollY;

  parallaxBgs.forEach(el => {
    const section = el.closest('.section');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const factor = 0.3;
    el.style.transform = `translateY(${rect.top * factor}px)`;
  });

  if (parallaxImg) {
    const section = parallaxImg.closest('.cinematic-wrap');
    if (section) {
      const rect = section.getBoundingClientRect();
      const factor = 0.25;
      parallaxImg.style.transform = `translateY(${rect.top * factor}px)`;
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// =============================================
// SCROLL REVEAL
// =============================================
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-fade, .reveal-left, .reveal-right, .reveal-card'
);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// =============================================
// SLIDER
// =============================================
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');
let current  = 0;
let sliderInterval;
let touchStartX = 0;

function goToSlide(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function nextSlide() { goToSlide(current + 1); }
function prevSlide() { goToSlide(current - 1); }

function startAuto() {
  clearInterval(sliderInterval);
  sliderInterval = setInterval(nextSlide, 2500);
}

document.getElementById('nextBtn').addEventListener('click', () => {
  nextSlide();
  startAuto();
});

document.getElementById('prevBtn').addEventListener('click', () => {
  prevSlide();
  startAuto();
});

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index));
    startAuto();
  });
});

// Touch support
const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

sliderContainer.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 40) {
    diff > 0 ? nextSlide() : prevSlide();
    startAuto();
  }
}, { passive: true });

startAuto();

// =============================================
// COUNTDOWN
// =============================================
const target = new Date('2026-05-22T18:00:00');

const daysEl    = document.getElementById('days');
const hoursEl   = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function pad(n) { return String(n).padStart(2, '0'); }

function tickEl(el, val) {
  const padded = pad(val);
  if (el.textContent !== padded) {
    el.textContent = padded;
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
    setTimeout(() => el.classList.remove('tick'), 250);
  }
}

function updateCountdown() {
  const now  = new Date();
  const diff = target - now;

  if (diff <= 0) {
    daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = '00';
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  tickEl(daysEl,    d);
  tickEl(hoursEl,   h);
  tickEl(minutesEl, m);
  tickEl(secondsEl, s);
}

updateCountdown();
setInterval(updateCountdown, 1000);
