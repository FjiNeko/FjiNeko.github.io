// 极简风格个人主页交互脚本

document.addEventListener('DOMContentLoaded', () => {

  // 1. 初始化 Lucide 图标
  if (window.lucide) {
    lucide.createIcons();
  }

  // 2. 标签页切换逻辑 (Tab Switching)
  const tabButtons = document.querySelectorAll('.nav-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // 更新按钮激活状态
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 切换内容面板
      tabPanes.forEach(pane => {
        if (pane.id === targetTabId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      // 重新触发图标渲染
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  });

  // 3. 全部开源仓库分类筛选 (Repository Category Filter)
  const filterButtons = document.querySelectorAll('.repo-filter-btn');
  const repoCards = document.querySelectorAll('.minimal-card[data-category]');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      // 更新过滤按钮样式
      filterButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-white', 'text-slate-950', 'font-bold');
        btn.classList.add('bg-white/[0.06]', 'text-slate-300');
      });

      button.classList.add('active', 'bg-white', 'text-slate-950', 'font-bold');
      button.classList.remove('bg-white/[0.06]', 'text-slate-300');

      // 过滤卡片展示
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

  // 4. 气泡提示与一键复制功能 (Toast & Copy)
  const toast = document.getElementById('toast-message');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2200);
  }

  // 复制邮箱按钮绑定
  const copyEmailBtns = [
    document.getElementById('copy-email-btn'),
    document.getElementById('about-copy-email-btn'),
    document.getElementById('footer-copy-email-btn')
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

});
