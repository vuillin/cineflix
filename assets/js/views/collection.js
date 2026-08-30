import { getFilms, getGenreFilter } from '../state.js';
import {
    clearElement,
    setEmptyListMessage,
    letterCategory,
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

export function initCollectionSearch() {
    const root = document.getElementById('header-search');
    const btn = document.getElementById('btn-search');
    const input = document.getElementById('header-search-input');
    if (!root || !btn || !input) return;

    const open = () => {
        root.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        input.tabIndex = 0;
        input.focus();
    };

    btn.addEventListener('click', () => {
        if (root.classList.contains('is-open')) {
            closeCollectionSearch();
        } else {
            open();
        }
    });

    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) {
            closeCollectionSearch();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && root.classList.contains('is-open')) {
            closeCollectionSearch();
        }
    });
}

export function renderCollection() {
    const listeFilms = document.getElementById('liste-films');
    if (!listeFilms) return;

    const films = getFilms();
    const currentGenreFilter = getGenreFilter();

    clearElement(listeFilms);

    let filmsAafficher = films;
    if (currentGenreFilter) {
        filmsAafficher = films.filter((film) => {
            if (!film.genres) return false;
            const genresDuFilm = film.genres.split(',').map((g) => g.trim());
            return genresDuFilm.includes(currentGenreFilter);
        });
    }

    if (filmsAafficher.length === 0) {
        if (currentGenreFilter) {
            setEmptyListMessage(listeFilms, `Aucun film trouvé pour le genre ${currentGenreFilter}.`);
        } else {
            setEmptyListMessage(listeFilms, 'Aucun film enregistré pour le moment.');
        }
        return;
    }

    let categorieEnCours = '';

    filmsAafficher.forEach((film) => {
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
