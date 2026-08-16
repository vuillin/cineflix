let currentView = 'view-accueil';

export function initNavigation({ onViewChange } = {}) {
    const navButtons = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');
    const subheaderCollection = document.getElementById('subheader-collection');
    const subheaderFavoris = document.getElementById('subheader-favoris');
    const netflixHeader = document.getElementById('netflix-header');
    const btnAjouterFilm = document.getElementById('btn-ajouter-film');

    function updateHeaderScroll() {
        if (currentView === 'view-accueil' && window.scrollY < 50) {
            netflixHeader.classList.remove('scrolled');
        } else {
            netflixHeader.classList.add('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeaderScroll);

    function switchView(targetId) {
        viewSections.forEach((section) => section.classList.add('hidden'));

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        if (subheaderCollection) {
            subheaderCollection.classList.toggle('hidden', targetId !== 'view-collection');
        }

        if (subheaderFavoris) {
            subheaderFavoris.classList.toggle('hidden', targetId !== 'view-favoris');
        }

        if (btnAjouterFilm) {
            btnAjouterFilm.classList.toggle('hidden', targetId !== 'view-collection');
        }

        currentView = targetId;
        updateHeaderScroll();

        if (typeof onViewChange === 'function') {
            onViewChange(targetId);
        }
    }

    navButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            navButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            switchView(btn.getAttribute('data-target'));
        });
    });

    switchView('view-accueil');

    return { switchView };
}
