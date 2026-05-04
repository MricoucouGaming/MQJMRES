document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     ÉLÉMENTS DU DOM
     ============================================================ */
  const body      = document.body;
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.querySelector('.overlay');
  const hamburger = document.querySelector('.hamburger');
  const menuBtn   = document.querySelector('.menu-btn');

  if (!sidebar) return;


  /* ============================================================
     SIDEBAR — OUVERTURE / FERMETURE
     ============================================================ */
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

  // Fermeture en cliquant sur l'overlay
  overlay?.addEventListener('click', (e) => {
    e.stopPropagation();
    setSidebarOpen(false);
  });

  // Fermeture en cliquant en dehors
  document.addEventListener('click', (e) => {
    if (!body.classList.contains('sidebar-open')) return;
    const t = e.target;
    if (sidebar.contains(t)) return;
    if (hamburger && (hamburger === t || hamburger.contains(t))) return;
    if (menuBtn   && (menuBtn   === t || menuBtn.contains(t)))   return;
    setSidebarOpen(false);
  });

  // Fermeture avec Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setSidebarOpen(false);
  });


  /* ============================================================
     SOUS-MENUS
     ============================================================ */
  document.querySelectorAll('.submenu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const submenu = btn.nextElementSibling;
      if (!submenu) return;

      const willOpen    = !submenu.classList.contains('open');
      const parentItem  = btn.closest('.menu-item');
      const parentScope = parentItem?.parentElement;

      // Ferme les frères au même niveau
      if (parentScope) {
        parentScope.querySelectorAll(':scope > .menu-item > .submenu').forEach(s => {
          if (s !== submenu) s.classList.remove('open');
        });
        parentScope.querySelectorAll(':scope > .menu-item > .submenu-btn').forEach(b => {
          if (b !== btn) b.classList.remove('active');
        });
      }

      submenu.classList.toggle('open', willOpen);
      btn.classList.toggle('active', willOpen);
    });
  });


  /* ============================================================
     LIGHTBOX
     ============================================================ */
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id        = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Fermer">×</button><img src="" alt="">';
    document.body.appendChild(lightbox);
  }

  const lbImg   = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.lightbox-close');

  const openLightbox = (src, alt = '') => {
    lbImg.src = src;
    lbImg.alt = alt;
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
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src, img.alt || '');
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lbClose) closeLightbox();
  });

  lbImg.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });


  /* ============================================================
     BARRE DE RECHERCHE
     ============================================================ */
  const searchInput = document.getElementById('sidebar-search');
  if (!searchInput) return;

  // Panneau de résultats
  const resultsPanel = document.createElement('div');
  resultsPanel.id = 'search-results';
  searchInput.closest('.sidebar-search-wrapper').insertAdjacentElement('afterend', resultsPanel);

  // Récupère tous les liens valides de la sidebar
  const allLinks = Array.from(sidebar.querySelectorAll('.submenu a:not(.sushiscan)'))
    .filter(a => a.textContent.trim() !== '' && a.getAttribute('href') !== '');

  // Normalise le texte pour la recherche (retire les accents)
  const normalize = (str) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  searchInput.addEventListener('input', () => {
    const query = normalize(searchInput.value.trim());
    resultsPanel.innerHTML = '';

    if (query === '') return;

    const matches = allLinks
      .filter(a => normalize(a.textContent.trim()).includes(query))
      .sort((a, b) => a.textContent.localeCompare(b.textContent, 'fr', { sensitivity: 'base' }));

    if (matches.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'Aucun résultat.';
      resultsPanel.appendChild(empty);
      return;
    }

    matches.forEach(original => {
      const link = document.createElement('a');
      link.href      = original.href;
      link.textContent = original.textContent.trim();
      link.className = 'search-result-btn';
      resultsPanel.appendChild(link);
    });
  });

});


/* ============================================================
   EFFET MACHINE À ÉCRIRE (titre principal)
   ============================================================ */
const titre = document.getElementById('titre-principal');
if (titre) {
  const texte = titre.textContent;
  titre.textContent = '';
  let i = 0;

  const ecrire = () => {
    if (i < texte.length) {
      titre.textContent += texte[i++];
      setTimeout(ecrire, 60);
    } else {
      setTimeout(() => titre.classList.add('fini'), 2000);
    }
  };

  ecrire();
}