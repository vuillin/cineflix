import { setGenreFilter, getGenreFilter } from '../state.js';

export function initGenresModal({ onFilterChange }) {
    const genreBtn = document.getElementById('genre-btn');
    const genreModal = document.getElementById('genre-modal');
    const closeGenreModalBtn = document.getElementById('close-genre-modal');

    if (!genreBtn || !genreModal || !closeGenreModalBtn) return;

    const openGenreModal = () => {
        genreModal.classList.remove('hidden-modal');
        document.body.style.overflow = 'hidden';
        const arrow = genreBtn.querySelector('.arrow-down');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    };

    const closeGenreModal = () => {
        genreModal.classList.add('hidden-modal');
        document.body.style.overflow = '';
        const arrow = genreBtn.querySelector('.arrow-down');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    };

    genreBtn.addEventListener('click', openGenreModal);
    closeGenreModalBtn.setAttribute('aria-label', 'Fermer les genres');

    closeGenreModalBtn.addEventListener('click', () => {
        if (getGenreFilter() !== null) {
            setGenreFilter(null);
            const pageTitle = document.querySelector('#subheader-collection .page-title');
            if (pageTitle) pageTitle.textContent = 'Films';
            onFilterChange();
        }
        closeGenreModal();
    });

    closeGenreModalBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeGenreModalBtn.click();
        }
    });

    genreModal.addEventListener('click', (e) => {
        if (e.target === genreModal) {
            closeGenreModal();
        }
    });

    document.querySelectorAll('.genre-card:not(.return-card)').forEach((option) => {
        option.setAttribute('role', 'button');
        option.setAttribute('tabindex', '0');

        const selectGenre = () => {
            const genreSelectionne = option.getAttribute('data-value');
            setGenreFilter(genreSelectionne);
            onFilterChange();

            const pageTitle = document.querySelector('#subheader-collection .page-title');
            if (pageTitle) {
                clearElementSafe(pageTitle);
                const breadcrumb = document.createElement('span');
                breadcrumb.className = 'breadcrumb clickable';
                breadcrumb.id = 'reset-genre-breadcrumb';
                breadcrumb.textContent = 'Films >';
                breadcrumb.addEventListener('click', () => {
                    setGenreFilter(null);
                    onFilterChange();
                    pageTitle.textContent = 'Films';
                });
                pageTitle.appendChild(breadcrumb);
                pageTitle.appendChild(document.createTextNode(` ${genreSelectionne}`));
            }

            closeGenreModal();
        };

        option.addEventListener('click', selectGenre);
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectGenre();
            }
        });
    });
}

function clearElementSafe(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}
