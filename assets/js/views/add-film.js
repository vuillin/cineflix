import { createMovie } from '../api/client.js';
import { invalidateFilms } from '../state.js';
import { normalizePosterFilename } from '../utils/dom.js';

export function initAddFilmForm({ reload }) {
    const form = document.getElementById('form-ajout-film');
    const sectionAjout = document.getElementById('section-ajout');
    const btnAjouterFilm = document.getElementById('btn-ajouter-film');
    const errorEl = document.getElementById('ajout-film-error');

    if (!form || !sectionAjout) return;

    const hideError = () => {
        if (!errorEl) return;
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
    };

    const showError = (message) => {
        if (!errorEl) {
            console.error(message);
            return;
        }
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    };

    if (btnAjouterFilm) {
        btnAjouterFilm.addEventListener('click', () => {
            sectionAjout.classList.toggle('hidden');
            if (!sectionAjout.classList.contains('hidden')) {
                form.reset();
                hideError();
            }
        });
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideError();

        const formData = new FormData(form);
        const tmdbId = Number(formData.get('tmdb_id'));
        let poster = formData.get('poster');

        if (!tmdbId) {
            showError('ID TMDB requis.');
            return;
        }

        const payload = { tmdb_id: tmdbId };
        if (poster) {
            payload.poster = normalizePosterFilename(String(poster));
        }

        try {
            const response = await createMovie(payload);
            const body = await response.json().catch(() => ({}));

            if (!response.ok) {
                showError(body.error || "Impossible d'ajouter le film.");
                return;
            }

            form.reset();
            sectionAjout.classList.add('hidden');
            invalidateFilms();
            reload();
        } catch (erreur) {
            console.error('Erreur de connexion :', erreur);
            showError('Erreur de connexion au serveur.');
        }
    });
}
