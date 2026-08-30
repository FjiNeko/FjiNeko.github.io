// TikTok Profile Page Interactive JavaScript

document.addEventListener('DOMContentLoaded', () => {

  // 1. TikTok Tab Switching Logic
  const tabButtons = document.querySelectorAll('.tiktok-tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Update Tab Button States
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update Tab Content Panels
      tabContents.forEach(content => {
        if (content.id === targetTabId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });

      // Refresh Lucide Icons if needed
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  });

  // 2. Repository Category Filter
  const filterButtons = document.querySelectorAll('.doc-filter-btn');
  const repoCards = document.querySelectorAll('.tiktok-card[data-category]');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      // Toggle active filter styles
      filterButtons.forEach(btn => {
        btn.classList.remove('bg-white', 'text-[#121212]');
        btn.classList.add('bg-[#242424]', 'text-[rgba(255,255,255,0.7)]');
      });

      button.classList.remove('bg-[#242424]', 'text-[rgba(255,255,255,0.7)]');
      button.classList.add('bg-white', 'text-[#121212]');

      // Filter Cards
      repoCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Search Bar Filter
  const searchInput = document.getElementById('tiktok-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      // Switch to Repositories tab if typing search
      const repoTabBtn = document.querySelector('[data-tab="tab-repos"]');
      if (query.length > 0 && repoTabBtn && !repoTabBtn.classList.contains('active')) {
        repoTabBtn.click();
      }

      repoCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 4. Toast & Copy Functions
  const toast = document.getElementById('tiktok-toast');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2400);
  }

  // Copy Email Buttons
  const copyEmailBtns = [
    document.getElementById('copy-email-btn'),
    document.getElementById('about-copy-email-btn')
  ];

  copyEmailBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'murdermobai0605@outlook.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ 邮箱地址已复制到剪贴板！');
      }).catch(() => {
        showToast('邮箱: ' + email);
      });
    });
  });

  // Share Profile Button
  const shareBtn = document.getElementById('header-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        showToast('✓ 主页链接已复制到剪贴板！');
      }).catch(() => {
        showToast('已复制主页链接');
      });
    });
  }

});
