import { fetchMovies } from './api/client.js';
import {
    getFilms,
    setFilms,
    invalidateFilms,
    isAccueilRendered,
    markAccueilRendered,
} from './state.js';
import { initNavigation } from './views/navigation.js';
import { initDetailsModal } from './views/details-modal.js';
import { initGenresModal } from './views/genres-modal.js';
import { initAddFilmForm } from './views/add-film.js';
import {
    renderCollection,
    updateGenreCardCounts,
    initCollectionSearch,
    closeCollectionSearch,
} from './views/collection.js';
import { renderFavoris } from './views/favoris.js';
import { renderAccueil } from './views/accueil.js';
import { ensureToastHost, toastError } from './components/toast.js';

async function chargerLesFilms() {
    const listeFilms = document.getElementById('liste-films');

    try {
        if (getFilms().length === 0) {
            const movies = await fetchMovies();
            setFilms(movies);
        }

        updateGenreCardCounts();
        renderCollection();
        renderFavoris();

        if (!isAccueilRendered()) {
            renderAccueil(getFilms());
            markAccueilRendered();
        }
    } catch (erreur) {
        console.error('Erreur de récupération :', erreur);
        toastError('Impossible de charger la bibliothèque');
        if (listeFilms) {
            listeFilms.textContent = '';
            const li = document.createElement('li');
            li.textContent = 'Erreur de communication avec le serveur.';
            listeFilms.appendChild(li);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ensureToastHost();

    const reload = () => {
        invalidateFilms();
        return chargerLesFilms();
    };

    initCollectionSearch();
    initNavigation({
        onViewChange: (viewId) => {
            if (viewId !== 'view-collection') closeCollectionSearch();
        },
    });
    initDetailsModal({ reload: chargerLesFilms });
    initGenresModal({ onFilterChange: () => chargerLesFilms() });
    initAddFilmForm({ reload });

    const closeDetailsBtn = document.getElementById('close-details-btn');
    if (closeDetailsBtn) {
        closeDetailsBtn.setAttribute('aria-label', 'Fermer la fiche film');
    }

    chargerLesFilms();
});
