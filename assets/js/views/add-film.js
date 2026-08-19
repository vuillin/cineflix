import { createMovie } from '../api/client.js';
import { invalidateFilms } from '../state.js';
import { normalizePosterFilename } from '../utils/dom.js';
import { toastAdded, toastError } from '../components/toast.js';

export function initAddFilmForm({ reload }) {
    const form = document.getElementById('form-ajout-film');
    const modal = document.getElementById('add-film-modal');
    const btnOpen = document.getElementById('btn-ajouter-film');
    const btnClose = document.getElementById('close-add-film-modal');
    const formatButtons = form ? form.querySelectorAll('.btn-format') : [];

    if (!form || !modal || !btnOpen) return;

    const resetFormats = () => {
        formatButtons.forEach((btn) => btn.classList.remove('active'));
    };

    const openModal = () => {
        form.reset();
        resetFormats();
        modal.classList.remove('hidden-modal');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.add('hidden-modal');
        document.body.style.overflow = '';
    };

    formatButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });

    btnOpen.addEventListener('click', openModal);

    if (btnClose) {
        btnClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const tmdbId = Number(formData.get('tmdb_id'));
        const poster = formData.get('poster');

        if (!tmdbId) {
            toastError('ID TMDB requis');
            return;
        }

        const payload = { tmdb_id: tmdbId };
        if (poster) {
            payload.poster = normalizePosterFilename(String(poster));
        }

        formatButtons.forEach((btn) => {
            const formatName = btn.getAttribute('data-format');
            payload[formatName] = btn.classList.contains('active') ? 1 : 0;
        });

        try {
            const response = await createMovie(payload);
            const body = await response.json().catch(() => ({}));

            if (!response.ok) {
                toastError(body.error || "Impossible d'ajouter le film");
                return;
            }

            form.reset();
            resetFormats();
            closeModal();
            invalidateFilms();
            reload();
            toastAdded();
        } catch (erreur) {
            console.error('Erreur de connexion :', erreur);
            toastError('Erreur de connexion au serveur');
        }
    });
}
