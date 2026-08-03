import { updateFavorite, deleteMovie, updateMovie } from '../api/client.js';
import { invalidateFilms } from '../state.js';
import { normalizePosterFilename, posterUrl, backdropUrl } from '../utils/dom.js';

let currentEditingFilmFromModal = null;
let onReload = null;

export function initDetailsModal({ reload }) {
    onReload = reload;
    const detailsModal = document.getElementById('movie-details-modal');
    const closeDetailsBtn = document.getElementById('close-details-btn');

    closeDetailsBtn.addEventListener('click', () => closeDetailsModal());

    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            closeDetailsModal();
        }
    });

    document.querySelectorAll('#form-edit-film-inplace .btn-format').forEach((btn) => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });
}

export function closeDetailsModal() {
    const detailsModal = document.getElementById('movie-details-modal');
    detailsModal.classList.add('hidden');
    document.body.style.overflow = '';
}

export function openMovieDetailsModal(film) {
    const detailsModal = document.getElementById('movie-details-modal');

    document.getElementById('details-movie-title').textContent = film.title;
    document.getElementById('details-year').textContent = film.release_year;

    const infoGrid = document.querySelector('.details-info-grid');
    const editGrid = document.querySelector('.details-edit-grid');

    if (infoGrid) infoGrid.classList.remove('fading-out');
    if (editGrid) editGrid.classList.add('hidden-fade');

    if (film.runtime && film.runtime > 0) {
        const h = Math.floor(film.runtime / 60);
        const m = film.runtime % 60;
        document.getElementById('details-runtime').textContent = h > 0 ? `${h}h ${m}m` : `${m}m`;
    } else {
        document.getElementById('details-runtime').textContent = 'Inconnue';
    }

    const matchScore = film.vote_average ? Math.round(film.vote_average * 10) : 75;
    document.getElementById('details-match').textContent = `Recommandé à ${matchScore}%`;

    let ageText = 'TP';
    if (film.certification) {
        ageText = film.certification;
        if (ageText === 'U') ageText = 'TP';
        if (ageText !== 'TP' && !ageText.includes('+') && !isNaN(ageText)) {
            ageText = ageText + '+';
        }
    } else {
        ageText = film.adult === 1 ? '18+' : '13+';
    }
    document.getElementById('details-age').textContent = ageText;

    syncFormatMeta(film);

    document.getElementById('details-overview').textContent = film.overview || 'Aucun synopsis disponible pour ce titre.';
    document.getElementById('details-cast').textContent = film.cast_members || 'Non renseigné';
    document.getElementById('details-director').textContent = film.director || 'Inconnu';
    document.getElementById('details-genres').textContent = film.genres || 'Non catégorisé';
    document.getElementById('details-production').textContent = film.production_companies || 'Non renseigné';
    document.getElementById('details-composer').textContent = film.composer || 'Inconnu';

    const pUrl = posterUrl(film.poster);
    const bUrl = backdropUrl(film.backdrop, film.poster);
    const headerBg = document.getElementById('details-header-bg');
    const posterImg = document.getElementById('details-poster');

    if (bUrl) {
        const safeUrl = bUrl.replace(/"/g, '');
        headerBg.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${safeUrl}")`;
    } else {
        headerBg.style.backgroundImage = 'none';
    }

    if (pUrl) {
        posterImg.src = pUrl;
        posterImg.alt = film.title || 'Affiche';
        posterImg.style.display = 'block';
    } else {
        posterImg.style.display = 'none';
    }

    const btnModalFavorite = document.getElementById('btn-modal-favorite');
    if (btnModalFavorite) {
        btnModalFavorite.classList.toggle('liked', film.is_favorite == 1);
        btnModalFavorite.setAttribute('aria-label', film.is_favorite == 1 ? 'Retirer des favoris' : 'Ajouter aux favoris');

        btnModalFavorite.onclick = async () => {
            const newState = film.is_favorite == 1 ? 0 : 1;
            try {
                const response = await updateFavorite(film.id, newState);
                if (response.ok) {
                    film.is_favorite = newState;
                    btnModalFavorite.classList.toggle('liked', newState === 1);
                    btnModalFavorite.setAttribute('aria-label', newState === 1 ? 'Retirer des favoris' : 'Ajouter aux favoris');
                    invalidateFilms();
                    if (onReload) onReload();
                } else {
                    console.error('Erreur lors de la mise à jour des favoris.');
                }
            } catch (erreur) {
                console.error('Erreur réseau / Favoris :', erreur);
            }
        };
    }

    const btnModalDelete = document.getElementById('btn-modal-delete');
    if (btnModalDelete) {
        btnModalDelete.setAttribute('aria-label', 'Supprimer le film');
        btnModalDelete.onclick = async () => {
            if (!confirm('Voulez-vous vraiment supprimer ce film de votre bibliothèque pour toujours ?')) {
                return;
            }
            try {
                const response = await deleteMovie(film.id);
                if (response.ok) {
                    closeDetailsModal();
                    invalidateFilms();
                    if (onReload) onReload();
                } else {
                    console.error("L'API a refusé la suppression");
                }
            } catch (erreur) {
                console.error('Erreur réseau :', erreur);
            }
        };
    }

    const btnModalEdit = document.getElementById('btn-modal-edit');
    if (btnModalEdit) {
        btnModalEdit.setAttribute('aria-label', 'Modifier le film');
        btnModalEdit.onclick = () => {
            if (infoGrid && editGrid) {
                infoGrid.classList.add('fading-out');
                editGrid.classList.remove('hidden-fade');

                currentEditingFilmFromModal = film;
                document.getElementById('inplace-edit-id').value = film.id;
                document.getElementById('inplace-edit-tmdb-id').value = film.tmdb_id || '';
                document.getElementById('inplace-edit-poster').value = film.poster
                    ? film.poster.replace('.webp', '')
                    : '';

                editGrid.querySelectorAll('.btn-format').forEach((btn) => {
                    const formatName = btn.getAttribute('data-format');
                    btn.classList.toggle('active', film[formatName] == 1);
                });
            }
        };
    }

    const btnModalInplaceCancel = document.getElementById('btn-modal-inplace-cancel');
    if (btnModalInplaceCancel) {
        btnModalInplaceCancel.onclick = () => {
            if (infoGrid && editGrid) {
                editGrid.classList.add('hidden-fade');
                infoGrid.classList.remove('fading-out');
            }
        };
    }

    const formEditFilmInplace = document.getElementById('form-edit-film-inplace');
    if (formEditFilmInplace) {
        formEditFilmInplace.onsubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData(formEditFilmInplace);
            const tmdbId = formData.get('tmdb_id');
            let poster = normalizePosterFilename(formData.get('poster'));

            const formatData = {};
            formEditFilmInplace.querySelectorAll('.btn-format').forEach((btn) => {
                const formatName = btn.getAttribute('data-format');
                formatData[formatName] = btn.classList.contains('active') ? 1 : 0;
            });

            const updatedFilm = Object.assign({}, currentEditingFilmFromModal, {
                tmdb_id: tmdbId,
                poster,
            }, formatData);

            try {
                const response = await updateMovie(updatedFilm);
                if (response.ok) {
                    const currentModalImg = detailsModal.querySelector('.details-poster-container img');
                    if (currentModalImg && poster) {
                        currentModalImg.src = posterUrl(poster);
                        currentModalImg.alt = updatedFilm.title || 'Affiche';
                    }

                    Object.assign(film, updatedFilm);
                    syncFormatMeta(updatedFilm);

                    if (infoGrid && editGrid) {
                        editGrid.classList.add('hidden-fade');
                        infoGrid.classList.remove('fading-out');
                    }

                    invalidateFilms();
                    if (onReload) onReload();
                } else {
                    console.error("L'API a refusé l'édition");
                }
            } catch (err) {
                console.error('Erreur réseau (Edition)', err);
            }
        };
    }

    detailsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function syncFormatMeta(film) {
    const metaDvd = document.getElementById('details-meta-dvd');
    const metaBluray = document.getElementById('details-meta-bluray');
    const metaSteelbook = document.getElementById('details-meta-steelbook');
    const metaCoffret = document.getElementById('details-meta-coffret');

    if (metaDvd) metaDvd.classList.toggle('hidden', film.dvd != 1);
    if (metaBluray) metaBluray.classList.toggle('hidden', film.bluray != 1);
    if (metaSteelbook) metaSteelbook.classList.toggle('hidden', film.steelbook != 1);
    if (metaCoffret) metaCoffret.classList.toggle('hidden', film.coffret != 1);
}
