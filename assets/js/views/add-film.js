import { createMovie, updateMovie, deleteMovie } from '../api/client.js';
import {
    getEditingFilmId,
    setEditingFilmId,
    invalidateFilms,
} from '../state.js';
import { normalizePosterFilename } from '../utils/dom.js';

export function initAddFilmForm({ reload }) {
    const form = document.getElementById('form-ajout-film');
    const sectionAjout = document.getElementById('section-ajout');
    const btnAjouterFilm = document.getElementById('btn-ajouter-film');
    const btnDelete = document.getElementById('btn-delete');
    const btnSubmit = form ? form.querySelector('button[type="submit"]') : null;
    const titleForm = sectionAjout ? sectionAjout.querySelector('h2') : null;

    if (!form || !sectionAjout) return;

    if (btnAjouterFilm) {
        btnAjouterFilm.addEventListener('click', () => {
            const willShow = sectionAjout.classList.contains('hidden');
            sectionAjout.classList.toggle('hidden');
            if (willShow) {
                form.reset();
                setEditingFilmId(null);
                if (titleForm) titleForm.textContent = 'Ajouter un nouveau film';
                if (btnSubmit) btnSubmit.textContent = 'Enregistrer le film';
                if (btnDelete) btnDelete.classList.add('hidden');
            }
        });
    }

    if (btnDelete) {
        btnDelete.addEventListener('click', async () => {
            const editingId = getEditingFilmId();
            if (!editingId) return;

            if (!confirm('Voulez-vous vraiment supprimer ce film pour toujours ?')) {
                return;
            }

            try {
                const response = await deleteMovie(editingId);
                if (response.ok) {
                    form.reset();
                    sectionAjout.classList.add('hidden');
                    btnDelete.classList.add('hidden');
                    setEditingFilmId(null);
                    invalidateFilms();
                    reload();
                } else {
                    console.error("L'API a refusé la suppression");
                }
            } catch (erreur) {
                console.error('Erreur réseau :', erreur);
            }
        });
    }

    form.addEventListener('submit', async (evenement) => {
        evenement.preventDefault();

        const formData = new FormData(form);
        const donnees = Object.fromEntries(formData.entries());

        if (donnees.poster) {
            donnees.poster = normalizePosterFilename(donnees.poster);
        }

        const editingId = getEditingFilmId();
        let response;

        try {
            if (editingId) {
                donnees.id = editingId;
                response = await updateMovie(donnees);
            } else {
                response = await createMovie(donnees);
            }

            if (response.ok) {
                form.reset();
                sectionAjout.classList.add('hidden');
                setEditingFilmId(null);
                if (titleForm) titleForm.textContent = 'Ajouter un nouveau film';
                if (btnSubmit) btnSubmit.textContent = 'Enregistrer le film';
                if (btnDelete) btnDelete.classList.add('hidden');
                invalidateFilms();
                reload();
            } else {
                const payload = await response.json().catch(() => ({}));
                console.error("L'API a renvoyé une erreur", payload);
            }
        } catch (erreur) {
            console.error('Erreur de connexion :', erreur);
        }
    });
}
