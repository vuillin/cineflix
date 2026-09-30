let currentView = 'view-accueil';

const VIEW_TO_HASH = {
    'view-accueil': 'accueil',
    'view-collection': 'collection',
    'view-favoris': 'favoris',
    'view-letterboxd': 'letterboxd',
};

const HASH_TO_VIEW = {
    accueil: 'view-accueil',
    collection: 'view-collection',
    favoris: 'view-favoris',
    letterboxd: 'view-letterboxd',
};

function viewFromHash() {
    const hash = window.location.hash.replace(/^#/, '');
    return HASH_TO_VIEW[hash] || 'view-accueil';
}

export function initNavigation({ onViewChange } = {}) {
    const navButtons = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');
    const subheaderCollection = document.getElementById('subheader-collection');
    const subheaderFavoris = document.getElementById('subheader-favoris');
    const subheaderLetterboxd = document.getElementById('subheader-letterboxd');
    const netflixHeader = document.getElementById('netflix-header');
    const collectionHeaderActions = document.getElementById('collection-header-actions');
    const letterboxdHeaderActions = document.getElementById('letterboxd-header-actions');

    function updateHeaderScroll() {
        if (currentView === 'view-accueil' && window.scrollY < 50) {
            netflixHeader.classList.remove('scrolled');
        } else {
            netflixHeader.classList.add('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeaderScroll);

    function syncActiveNav(targetId) {
        navButtons.forEach((btn) => {
            btn.classList.toggle('active', btn.getAttribute('data-target') === targetId);
        });
    }

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

        if (subheaderLetterboxd) {
            subheaderLetterboxd.classList.toggle('hidden', targetId !== 'view-letterboxd');
        }

        if (collectionHeaderActions) {
            collectionHeaderActions.classList.toggle('hidden', targetId !== 'view-collection');
        }

        if (letterboxdHeaderActions) {
            letterboxdHeaderActions.classList.toggle('hidden', targetId !== 'view-letterboxd');
        }

        currentView = targetId;
        updateHeaderScroll();

        if (typeof onViewChange === 'function') {
            onViewChange(targetId);
        }
    }

    function applyView(targetId) {
        const viewId = document.getElementById(targetId) ? targetId : 'view-accueil';
        syncActiveNav(viewId);
        switchView(viewId);
    }

    function goTo(targetId) {
        const hash = VIEW_TO_HASH[targetId] || 'accueil';
        const next = `#${hash}`;
        if (window.location.hash === next) {
            applyView(targetId);
        } else {
            window.location.hash = hash;
        }
    }

    navButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            goTo(btn.getAttribute('data-target'));
        });
    });

    const logoHome = document.getElementById('logo-home');
    if (logoHome) {
        logoHome.addEventListener('click', (event) => {
            event.preventDefault();
            goTo('view-accueil');
        });
    }

    window.addEventListener('hashchange', () => {
        applyView(viewFromHash());
    });

    const initialView = viewFromHash();
    if (!window.location.hash) {
        history.replaceState(null, '', `#${VIEW_TO_HASH[initialView]}`);
    }
    applyView(initialView);

    return { switchView: goTo };
}
