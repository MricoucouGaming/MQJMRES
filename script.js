document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  const hamburger = document.querySelector('.hamburger');
  const menuBtn = document.querySelector('.menu-btn');

  if (!sidebar) return; // rien à faire si pas de sidebar

  // centralisé: ouvre/ferme le menu via la classe sur le body
  const setSidebarOpen = (open) => {
    body.classList.toggle('sidebar-open', open);
    sidebar.setAttribute('aria-hidden', String(!open));
    if (!open) {
      // fermer tous les sous-menus quand on ferme la sidebar
      document.querySelectorAll('.submenu').forEach(s => s.classList.remove('open'));
      document.querySelectorAll('.submenu-btn').forEach(b => b.classList.remove('active'));
    }
  };

  // garantit l'état fermé au chargement
  setSidebarOpen(false);

  // empêche la propagation des clics internes (utile pour document click)
  sidebar.addEventListener('click', e => e.stopPropagation());

  // gestion des toggles principaux (hamburger / menu principal)
  const toggleSidebar = (e) => {
    if (e) e.stopPropagation();
    setSidebarOpen(!body.classList.contains('sidebar-open'));
  };
  hamburger?.addEventListener('click', toggleSidebar);
  menuBtn?.addEventListener('click', toggleSidebar);

  // clic sur overlay ferme
  overlay?.addEventListener('click', (e) => { e.stopPropagation(); setSidebarOpen(false); });

  // clic n'importe où (hors sidebar/hamburger/menuBtn) ferme
  document.addEventListener('click', (e) => {
    if (!body.classList.contains('sidebar-open')) return;
    const target = e.target;
    if (sidebar.contains(target)) return;
    if (hamburger && (hamburger === target || hamburger.contains(target))) return;
    if (menuBtn && (menuBtn === target || menuBtn.contains(target))) return;
    setSidebarOpen(false);
  });

  // Escape ferme
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setSidebarOpen(false); });

  // sous-menus : ouvre sous le bouton, ferme les autres par défaut
  document.querySelectorAll('.submenu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const submenu = btn.nextElementSibling;
      if (!submenu) return;
      const willOpen = !submenu.classList.contains('open');

      // bascule le cliqué
      submenu.classList.toggle('open', willOpen);
      btn.classList.toggle('active', willOpen);

      // ferme les autres pour garder l'UI propre (retirer si tu veux multiselection)
      document.querySelectorAll('.submenu').forEach(s => { if (s !== submenu) s.classList.remove('open'); });
      document.querySelectorAll('.submenu-btn').forEach(b => { if (b !== btn) b.classList.remove('active'); });
    });
  });

  /* ---------- Lightbox / zoomable images ---------- */
  // crée automatiquement l'élément lightbox si absent
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
    lbImg.src = src;
    lbImg.alt = alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // bloque le scroll sous la lightbox
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.style.overflow = '';
  };

  // ouvre la lightbox au clic sur les images qui ont la classe .zoomable
  document.querySelectorAll('.zoomable').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src, img.alt || '');
    });
  });

  // fermer lightbox : clic fond ou bouton ou ESC
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lbClose) closeLightbox();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });

  // empêche click sur lightbox img de fermer (si ever)
  lbImg.addEventListener('click', e => e.stopPropagation());
});

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
    // L'écriture est finie, on attend 2 secondes puis on retire le curseur
    setTimeout(() => {
      titre.classList.add("fini");
    }, 2000); // 2000ms = 2 secondes, ajuste à ton goût
  }
}
ecrire();
