// Initialize Lucide Icons & Interactions
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initScrollSpy();
  initMobileSidebar();
  initTypingEffect();
  initAmbientCanvas();
  initRepositoryFilter();
  initCopyActions();
  initPawClickEffect();
});

// ====================================================
// 🧭 ScrollSpy: Real-time Active Nav Highlighting (GameSci style)
// ====================================================
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('#sidebar-nav .nav-item');

  function updateActiveNav() {
    let scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

// ====================================================
// 📱 Mobile Sidebar Drawer Toggle
// ====================================================
function initMobileSidebar() {
  const toggleBtn = document.getElementById('mobile-sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('mobile-backdrop');
  const navLinks = document.querySelectorAll('#sidebar-nav a');

  function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.remove('hidden');
  }

  function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', openSidebar);
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });
}

// ====================================================
// ✍️ Dynamic Typing Effect
// ====================================================
function initTypingEffect() {
  const words = [
    "Python 爬虫与数据流水线开发",
    "Flask / FastAPI 全栈架构探索",
    "OBS 实时像素音乐挂件制作者",
    "实用效率与桌面工具打造者",
    "Keep smiling everyday 🙂"
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
      typingSpeed = 2200; // Pause when complete
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

// ====================================================
// ✨ Ambient Floating Particles Canvas (Warm Coffee Sparks)
// ====================================================
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 30), 45);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.15, // Floating gently upwards
      radius: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.45 + 0.15,
      color: Math.random() > 0.4 ? 'rgba(251, 191, 36,' : 'rgba(244, 114, 182,'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color} ${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

// ====================================================
// 🗂️ Repositories Category Filter Tabs
// ====================================================
function initRepositoryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#repositories-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'flex';
          card.classList.add('animate-fade');
        } else {
          const categories = card.getAttribute('data-category').split(' ');
          if (categories.includes(filter)) {
            card.style.display = 'flex';
            card.classList.add('animate-fade');
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
}

// ====================================================
// 📋 Copy Email & Interactions
// ====================================================
function initCopyActions() {
  const copyButtons = [
    document.getElementById('sidebar-copy-email'),
    document.getElementById('hero-copy-email-btn'),
    document.getElementById('main-copy-email-btn')
  ];
  const copyToast = document.getElementById('copy-toast');

  copyButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        if (copyToast) {
          copyToast.classList.remove('hidden');
          setTimeout(() => {
            copyToast.classList.add('hidden');
          }, 3000);
        }
      } catch (err) {
        prompt('请手动复制邮箱：', email);
      }
    });
  });
}

// ====================================================
// 🐾 Cat Paw Click Effect
// ====================================================
function initPawClickEffect() {
  const pawIcons = ['🐾', '🐱', '✨', '☕', '🌟'];
  
  document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) {
      return;
    }

    const paw = document.createElement('div');
    paw.className = 'paw-ripple';
    paw.textContent = pawIcons[Math.floor(Math.random() * pawIcons.length)];
    paw.style.left = `${e.clientX}px`;
    paw.style.top = `${e.clientY}px`;

    document.body.appendChild(paw);

    setTimeout(() => {
      paw.remove();
    }, 800);
  });
}
