document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  const hamburger = document.querySelector('.hamburger');
  const menuBtn = document.querySelector('.menu-btn');

  if (!sidebar) return;

  const setSidebarOpen = (open) => {
    body.classList.toggle('sidebar-open', open);
    sidebar.setAttribute('aria-hidden', String(!open));
    if (!open) {
      document.querySelectorAll('.submenu').forEach(s => s.classList.remove('open'));
      document.querySelectorAll('.submenu-btn').forEach(b => b.classList.remove('active'));
    }
  };

  setSidebarOpen(false);
  sidebar.addEventListener('click', e => e.stopPropagation());

  const toggleSidebar = (e) => {
    if (e) e.stopPropagation();
    setSidebarOpen(!body.classList.contains('sidebar-open'));
  };
  hamburger?.addEventListener('click', toggleSidebar);
  menuBtn?.addEventListener('click', toggleSidebar);

  overlay?.addEventListener('click', (e) => { e.stopPropagation(); setSidebarOpen(false); });

  document.addEventListener('click', (e) => {
    if (!body.classList.contains('sidebar-open')) return;
    const target = e.target;
    if (sidebar.contains(target)) return;
    if (hamburger && (hamburger === target || hamburger.contains(target))) return;
    if (menuBtn && (menuBtn === target || menuBtn.contains(target))) return;
    setSidebarOpen(false);
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setSidebarOpen(false); });

  /* ---------- Sous-menus ---------- */
  document.querySelectorAll('.submenu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const submenu = btn.nextElementSibling;
      if (!submenu) return;

      const willOpen = !submenu.classList.contains('open');
      submenu.classList.toggle('open', willOpen);
      btn.classList.toggle('active', willOpen);

      // Ferme uniquement les frères (siblings) au même niveau, pas les parents
      const parentItem = btn.closest('.menu-item');
      const parentSubmenu = parentItem ? parentItem.parentElement : null;

      if (parentSubmenu) {
        parentSubmenu.querySelectorAll(':scope > .menu-item > .submenu').forEach(s => {
          if (s !== submenu) {
            s.classList.remove('open');
          }
        });
        parentSubmenu.querySelectorAll(':scope > .menu-item > .submenu-btn').forEach(b => {
          if (b !== btn) {
            b.classList.remove('active');
          }
        });
      }
    });
  });

  /* ---------- Lightbox ---------- */
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Fermer">×</button><img src="" alt="">';
    document.body.appendChild(lightbox);
  }
  const lbImg = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.lightbox-close');

  const openLightbox = (src, alt = '') => {
    lbImg.src = src; lbImg.alt = alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.zoomable').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(img.src, img.alt || ''); });
  });

  lightbox.addEventListener('click', (e) => { if (e.target === lightbox || e.target === lbClose) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });
  lbImg.addEventListener('click', e => e.stopPropagation());

  /* ---------- Barre de recherche dans la sidebar ---------- */
  const searchInput = document.getElementById('sidebar-search');
  if (!searchInput) return;

  const resultsPanel = document.createElement('div');
  resultsPanel.id = 'search-results';
  searchInput.closest('.sidebar-search-wrapper').insertAdjacentElement('afterend', resultsPanel);

  const allLinks = Array.from(sidebar.querySelectorAll('.submenu a:not(.sushiscan)'))
    .filter(a => a.textContent.trim() !== '' && a.getAttribute('href') !== '');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    resultsPanel.innerHTML = '';

    if (query === '') return;

    const matches = allLinks.filter(a => {
      const text = a.textContent.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return text.includes(query);
    });

    if (matches.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'Aucun personnage trouvé.';
      resultsPanel.appendChild(empty);
      return;
    }

    const sorted = [...matches].sort((a, b) =>
      a.textContent.localeCompare(b.textContent, 'fr', { sensitivity: 'base' })
    );

    sorted.forEach(original => {
      const btn = document.createElement('a');
      btn.href = original.href;
      btn.textContent = original.textContent.trim();
      btn.className = 'search-result-btn';
      resultsPanel.appendChild(btn);
    });
  });
});

/* ---------- Effet machine à écrire ---------- */
const titre = document.getElementById("titre-principal");
const texte = titre.textContent;
titre.textContent = "";

let i = 0;
function ecrire() {
  if (i < texte.length) {
    titre.textContent += texte[i];
    i++;
    setTimeout(ecrire, 60);
  } else {
    setTimeout(() => { titre.classList.add("fini"); }, 2000);
  }
}
ecrire();