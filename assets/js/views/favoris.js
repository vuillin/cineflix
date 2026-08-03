import { getFilms } from '../state.js';
import { clearElement } from '../utils/dom.js';
import { openMovieDetailsModal } from './details-modal.js';

export function renderFavoris() {
    const listeFavoris = document.getElementById('liste-favoris');
    if (!listeFavoris) return;

    clearElement(listeFavoris);

    const filmsFavoris = getFilms().filter((film) => film.is_favorite == 1);

    if (filmsFavoris.length === 0) {
        const li = document.createElement('li');
        li.style.gridColumn = '1 / -1';
        li.style.textAlign = 'center';
        li.style.padding = '50px';
        li.style.color = '#888';
        li.textContent = "Vous n'avez pas encore de favoris. Cliquez sur le cœur d'un film pour l'ajouter.";
        listeFavoris.appendChild(li);
        return;
    }

    filmsFavoris.forEach((film) => {
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

        listeFavoris.appendChild(li);
    });
}
