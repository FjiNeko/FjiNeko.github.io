// Initialize Lucide Icons & GitBook Doc Interactions
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initScrollSpy();
  initMobileSidebar();
  initQuickSearch();
  initRepositoryFilter();
  initCopyActions();
});

// ====================================================
// 🧭 ScrollSpy: Active Section Highlighting in GitBook Tree
// ====================================================
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('#sidebar-nav .doc-nav-link');

  function updateActiveLink() {
    let scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

// ====================================================
// 🔍 Quick Search & Ctrl+K Shortcut
// ====================================================
function initQuickSearch() {
  const searchInput = document.getElementById('quick-search');
  if (!searchInput) return;

  // Keyboard Shortcut: Ctrl + K or Cmd + K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Live client-side filtering on repositories & content
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const repoCards = document.querySelectorAll('#repositories-grid .doc-repo-card');

    repoCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query) || query === '') {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// ====================================================
// 📱 Mobile Sidebar Toggle
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
// 🗂️ Repositories Category Filter Tabs
// ====================================================
function initRepositoryFilter() {
  const filterBtns = document.querySelectorAll('.doc-filter-btn');
  const repoCards = document.querySelectorAll('#repositories-grid .doc-repo-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      repoCards.forEach(card => {
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
// 📋 Copy Code & Email Actions
// ====================================================
function initCopyActions() {
  // Copy Code Snippets
  const codeBtns = document.querySelectorAll('.copy-code-btn');
  codeBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = btn.getAttribute('data-code');
      try {
        await navigator.clipboard.writeText(code);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span class="text-[10px] text-emerald-400 font-mono">Copied!</span>';
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2000);
      } catch (err) {
        prompt('请手动复制命令：', code);
      }
    });
  });

  // Copy Email Buttons
  const copyButtons = [
    document.getElementById('sidebar-copy-btn'),
    document.getElementById('main-copy-email-btn')
  ];
  const copyToast = document.getElementById('copy-toast');

  copyButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email') || 'murdermobai0605@outlook.com';
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
