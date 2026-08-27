import { createMovie, fetchTmdbPreview } from '../api/client.js';
import { invalidateFilms } from '../state.js';
import { normalizePosterFilename, posterUrl } from '../utils/dom.js';
import { toastAdded, toastError } from '../components/toast.js';

export function initAddFilmForm({ reload }) {
    const form = document.getElementById('form-ajout-film');
    const modal = document.getElementById('add-film-modal');
    const btnOpen = document.getElementById('btn-ajouter-film');
    const btnClose = document.getElementById('close-add-film-modal');
    const formatButtons = form ? form.querySelectorAll('.btn-format') : [];
    const submitBtn = document.getElementById('btn-submit-add-film');
    let isSubmitting = false;

    const tmdbInput = document.getElementById('tmdb_id');
    const posterInput = document.getElementById('poster');
    const posterFrame = document.getElementById('add-film-poster-preview');
    const posterImg = document.getElementById('add-film-poster-img');
    const previewValueEl = document.querySelector('#add-film-preview .add-film-preview__value');

    let previewTimer = null;
    let previewAbortController = null;
    let previewRequestId = 0;
    let posterTimer = null;
    let posterRequestId = 0;

    if (!form || !modal || !btnOpen) return;

    const resetFormats = () => {
        formatButtons.forEach((btn) => btn.classList.remove('active'));
    };

    const resetPreview = () => {
        if (!previewValueEl) return;
        previewValueEl.textContent = '-';
        previewValueEl.classList.remove('is-loading', 'is-error');
    };

    const setPreviewLoading = () => {
        if (!previewValueEl) return;
        previewValueEl.textContent = '…';
        previewValueEl.classList.add('is-loading');     
        previewValueEl.classList.remove('is-error');
    };

    const setPreviewResult = (text) => {
        if (!previewValueEl) return;
        previewValueEl.textContent = text;
        previewValueEl.classList.remove('is-loading', 'is-error');
    };

    const setPreviewError = (text) => {
        if (!previewValueEl) return;
        previewValueEl.textContent = text;
        previewValueEl.classList.add('is-error');
        previewValueEl.classList.remove('is-loading');
    };

    const formatPreviewLabel = ({ title, release_year }) => {
        if (!title) return 'Film introuvable';
        return release_year ? `${title} (${release_year})` : title;
    };

    const schedulePreview = (rawValue) => {
        if (previewTimer) {
            clearTimeout(previewTimer);
        }

        if (previewAbortController) {
            previewAbortController.abort();
            previewAbortController = null;
        }

        const tmdbId = Number(rawValue);
        if (!tmdbId || tmdbId <= 0) {
            resetPreview();
            return;
        }

        previewTimer = window.setTimeout(async () => {

            const requestId = ++previewRequestId;
            previewAbortController = new AbortController();
            setPreviewLoading();

            try {
                const preview = await fetchTmdbPreview(tmdbId, {
                    signal: previewAbortController.signal,
                });
                if (requestId !== previewRequestId) return;
                setPreviewResult(formatPreviewLabel(preview));

            } catch (error) {

                if (error.name === 'AbortError') return;
                if (requestId !== previewRequestId) return;

                if (error.status === 404) {
                    setPreviewError('Film introuvable');
                } else if (error.status === 503) {
                    setPreviewError('Clé TMDB absente ou invalide');
                } else if (error.status === 502) {
                    setPreviewError('TMDB indisponible');
                } else {
                    setPreviewError(error.message || 'Erreur TMDB');
                }   
            
            } finally {

                if (requestId === previewRequestId) {
                    previewAbortController = null;
                }
            }

        }, 400);
    };

    const resetPosterPreview = () => {
        if (!posterFrame || !posterImg) return;

        posterFrame.classList.add('add-film-poster__frame--empty');
        posterImg.classList.add('hidden');
        posterImg.hidden = true;
        posterImg.removeAttribute('src');
        posterImg.alt = '';
    };

    const schedulePosterPreview = (rawValue) => {
        if (posterTimer) {
            clearTimeout(posterTimer);
        }

        const trimmed = String(rawValue || '').trim();
        if (!trimmed) {
            resetPosterPreview();
            return;
        }

        posterTimer = window.setTimeout(() => {
            const requestId = ++posterRequestId;
            const filename = normalizePosterFilename(trimmed);
            const url = posterUrl(filename);

            if (!url) {
                resetPosterPreview();
                return;
            }

            const probe = new Image();
            probe.onload = () => {
                if (requestId !== posterRequestId) return;

                posterImg.src = url;
                posterImg.alt = 'Aperçu affiche';
                posterImg.classList.remove('hidden');
                posterImg.hidden = false;
                posterFrame.classList.remove('add-film-poster__frame--empty');
            };
            probe.onerror = () => {
                if (requestId !== posterRequestId) return;
                resetPosterPreview();
            };
            probe.src = url;
        }, 300);
    };

    const setSubmitting = (loading) => {
        isSubmitting = loading;

        if (submitBtn) {
            submitBtn.disabled = loading;
            submitBtn.classList.toggle('is-loading', loading);
            submitBtn.setAttribute('aria-busy', loading ? 'true' : 'false');
        }

        if (btnClose) {
            btnClose.disabled = loading;
        }

        formatButtons.forEach((btn) => {
            btn.disabled = loading;
        });
    }

    const openModal = () => {
        form.reset();

        resetPreview();
        if (previewTimer) {
            clearTimeout(previewTimer);
            previewTimer = null;
        }
        if (posterTimer) {
            clearTimeout(posterTimer);
            posterTimer = null;
        }
        if (previewAbortController) {
            previewAbortController.abort();
            previewAbortController = null;
        }
        previewRequestId++;
        posterRequestId++;
        resetPosterPreview();

        resetFormats();
        modal.classList.remove('hidden-modal');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (isSubmitting) return;

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

    if (tmdbInput) {
        tmdbInput.addEventListener('input', () => {
            schedulePreview(tmdbInput.value);
        });
    }

    if (posterInput) {
        posterInput.addEventListener('input', () => {
            schedulePosterPreview(posterInput.value);
        });
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (isSubmitting) return;

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

        setSubmitting(true);

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
        } finally {
            setSubmitting(false);
        }
    });
}
