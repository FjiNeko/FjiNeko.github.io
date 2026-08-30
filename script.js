// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initTypingEffect();
  initParticleCanvas();
  initInteractions();
});

// Dynamic Typing Effect
function initTypingEffect() {
  const words = [
    "Python Developer & Scripting",
    "Tool Builder & Automation Explorer",
    "OBS Widget & Streaming Tech Creator",
    "Open Source & Geek Crafting"
  ];
  
  const textElement = document.getElementById('typed-text');
  if (!textElement) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// Particle Canvas Animation
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 25), 45);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(45, 212, 191, ${p.alpha})`;
      ctx.fill();

      // Connect close particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

// User Interactions
function initInteractions() {
  // Mobile Menu Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close mobile menu on click link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // Copy Email Button
  const copyBtn = document.getElementById('copy-email-btn');
  const copyToast = document.getElementById('copy-toast');
  if (copyBtn && copyToast) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        copyToast.classList.remove('hidden');
        setTimeout(() => {
          copyToast.classList.add('hidden');
        }, 3000);
      } catch (err) {
        prompt('请手动复制邮箱：', email);
      }
    });
  }

  // Set Current Year
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
