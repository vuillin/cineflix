import {
    getFilms,
    getGenreFilter,
    getSearchQuery,
    setSearchQuery,
    clearSearchQuery,
} from '../state.js';
import {
    clearElement,
    setEmptyListMessage,
    letterCategory,
    filmMatchesSearch,
} from '../utils/dom.js';
import { openMovieDetailsModal } from './details-modal.js';

export function closeCollectionSearch() {
    const root = document.getElementById('header-search');
    const btn = document.getElementById('btn-search');
    const input = document.getElementById('header-search-input');
    if (!root) return;

    root.classList.remove('is-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (input) {
        input.blur();
        input.tabIndex = -1;
    }
}

export function resetCollectionSearch() {
    const input = document.getElementById('header-search-input');
    if (input) input.value = '';

    clearSearchQuery();
    closeCollectionSearch();
    renderCollection();
}

export function initCollectionSearch() {
    const root = document.getElementById('header-search');
    const btn = document.getElementById('btn-search');
    const input = document.getElementById('header-search-input');
    if (!root || !btn || !input) return;

    let debounceTimer = null;

    const open = () => {
        root.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        input.tabIndex = 0;
        input.focus();
    };

    const applySearch = (value) => {
        setSearchQuery(value);
        renderCollection();
    };

    btn.addEventListener('click', () => {
        if (root.classList.contains('is-open')) {
            closeCollectionSearch();
        } else {
            open();
        }
    });

    input.addEventListener('input', () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
            applySearch(input.value);
        }, 150);
    });

    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) {
            closeCollectionSearch();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !root.classList.contains('is-open')) return;

        if (input.value.trim() !== '') {
            input.value = '';
            applySearch('');
        }
        closeCollectionSearch();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== '/') return;

        const target = event.target;
        const tag = target && target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || (target && target.isContentEditable)) {
            return;
        }

        const collectionView = document.getElementById('view-collection');
        if (!collectionView || collectionView.classList.contains('hidden')) return;

        event.preventDefault();
        open();
    });
}

export function renderCollection() {
    const listeFilms = document.getElementById('liste-films');
    if (!listeFilms) return;

    const films = getFilms();
    const currentGenreFilter = getGenreFilter();
    const searchQuery = getSearchQuery().trim();
    const hasSearch = searchQuery !== '';

    clearElement(listeFilms);

    let filmsAafficher = films;

    if (currentGenreFilter) {
        filmsAafficher = films.filter((film) => {
            if (!film.genres) return false;
            const genresDuFilm = film.genres.split(',').map((g) => g.trim());
            return genresDuFilm.includes(currentGenreFilter);
        });
    }

    if (hasSearch) {
        filmsAafficher = filmsAafficher.filter((film) =>
            filmMatchesSearch(film, searchQuery)
        );
    }

    if (filmsAafficher.length === 0) {

        if (hasSearch) {
            setEmptyListMessage(
                listeFilms,
                `Aucun film trouvé pour « ${searchQuery} ».`
            );
        } else if (currentGenreFilter) {
            setEmptyListMessage(listeFilms, `Aucun film trouvé pour le genre ${currentGenreFilter}.`);
        } else {
            setEmptyListMessage(listeFilms, 'Aucun film enregistré pour le moment.');
        }
        return;
    }

    let categorieEnCours = '';

    if (hasSearch) {
        const spacer = document.createElement('li');
        spacer.className = 'letter-separator letter-separator--ghost';
        spacer.setAttribute('aria-hidden', 'true');
        const heading = document.createElement('h2');
        heading.textContent = 'A-C';
        spacer.appendChild(heading);
        listeFilms.appendChild(spacer);
    }

    filmsAafficher.forEach((film) => {

        if (!hasSearch) {
            const category = letterCategory(film.sort_title);

            if (category !== categorieEnCours) {
                const separator = document.createElement('li');
                separator.className = 'letter-separator';
                const heading = document.createElement('h2');
                heading.textContent = category;
                separator.appendChild(heading);
                listeFilms.appendChild(separator);
                categorieEnCours = category;
            }
        }

        const li = document.createElement('li');
        li.className = 'movie-card';
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', '0');
        li.setAttribute('aria-label', film.title || 'Film');

        if (film.poster) {
            li.style.backgroundImage = `url("assets/images/small/${film.poster.replace(/"/g, '')}")`;
        }

        const open = () => openMovieDetailsModal(film);
        li.addEventListener('click', open);
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });

        listeFilms.appendChild(li);
    });
}

export function updateGenreCardCounts() {
    const films = getFilms();
    const genreCounts = {};

    films.forEach((film) => {
        if (!film.genres) return;
        film.genres.split(',').map((g) => g.trim()).forEach((g) => {
            genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
    });

    document.querySelectorAll('.genre-card:not(.return-card)').forEach((card) => {
        const genreName = card.getAttribute('data-value');
        const count = genreCounts[genreName] || 0;
        const pText = card.querySelector('p');
        if (pText) {
            pText.textContent = `${count} film${count > 1 ? 's' : ''} dans la bibliothèque`;
        }
    });
}
