const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

resize();
window.addEventListener("resize", resize);

const dots = [];
const DOT_COUNT = 80;

for (let i = 0; i < DOT_COUNT; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 2 + 1
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // move + draw dots
  dots.forEach(dot => {
    dot.x += dot.vx;
    dot.y += dot.vy;

    if (dot.x < 0) dot.x = canvas.width;
    if (dot.x > canvas.width) dot.x = 0;
    if (dot.y < 0) dot.y = canvas.height;
    if (dot.y > canvas.height) dot.y = 0;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
  });

  // connect nearby dots
  const MAX_DISTANCE = 120;

  for (let i = 0; i < dots.length; i++) {
    let connections = 0;

    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < MAX_DISTANCE && connections < 3) {
        const opacity = 1 - distance / MAX_DISTANCE;

        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        connections++;
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();

//inertia scroll

const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 0.9,
  smoothWheel: true,
  smoothTouch: false
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

//section

const sections = document.querySelectorAll('section');

function updateSections() {
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const height = rect.height;

    // progress of THIS section entering
    let progress = Math.min(Math.max(1 - rect.top / height, 0), 1);

    // easing
    progress = 1 - Math.pow(1 - progress, 3);

    // reset current section (always sharp)
    section.style.transform = `scale(1)`;
    section.style.filter = `blur(0px)`;
    section.style.opacity = 1;

    // apply effect to PREVIOUS section
    if (index > 0) {
      const prev = sections[index - 1];

      const scale = 1 - progress * 0.08;

      prev.style.transform = `scale(${scale})`;
    }
  });
}

function raf(time) {
  lenis.raf(time);
  updateSections();
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

//animations

const reveals = document.querySelectorAll('.reveal');

function updateReveal() {
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.85) {
      el.classList.add('active');
    }
  });
}

// hook into your existing RAF (important)
function raf(time) {
  lenis.raf(time);
  updateSections();
  updateReveal();
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

//scroll bar

const scrollFill = document.querySelector('.scroll-fill');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    scrollFill.style.height = scrollPercent + '%';
});
