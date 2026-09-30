import { importLetterboxdWatches, importLetterboxdRatings } from '../api/client.js';
import {
    getFilms,
    getLetterboxdSortMode,
    setLetterboxdSortMode,
} from '../state.js';
import { clearElement, appendRatingStars } from '../utils/dom.js';
import { openMovieDetailsModal } from './details-modal.js';
import { toastError, toastSuccess } from '../components/toast.js';

function parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current);
    return result;
}

function parseWatchedCsv(text) {
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim() !== '');
    if (lines.length < 2) return [];

    // Date,Name,Year,Letterboxd URI
    const watches = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (cols.length < 3) continue;

        const date = cols[0].trim();
        const title = cols[1].trim();
        const year = Number(cols[2].trim());

        if (!title || !year || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
        watches.push({ title, year, date });
    }
    return watches;
}

function parseRatingsCsv(text) {
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim() !== '');
    if (lines.length < 2) return [];

    // Date,Name,Year,Letterboxd URI,Rating
    const ratings = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (cols.length < 5) continue;

        const date = cols[0].trim();
        const title = cols[1].trim();
        const year = Number(cols[2].trim());
        const rating = Number(cols[4].trim());

        if (!title || !year || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
        if (!rating || rating < 0.5 || rating > 5) continue;

        ratings.push({ title, year, date, rating });
    }
    return ratings;
}

function wireCsvImport({ btnId, inputId, status, parse, send, loadingLabel, reload }) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', () => input.click());

    input.addEventListener('change', async () => {
        const file = input.files && input.files[0];
        input.value = '';
        if (!file) return;

        try {
            if (status) status.textContent = 'Lecture du CSV…';
            const text = await file.text();
            const rows = parse(text);

            if (rows.length === 0) {
                toastError('CSV vide ou format invalide');
                if (status) status.textContent = '';
                return;
            }

            if (status) status.textContent = loadingLabel(rows.length);

            const response = await send(rows);
            const body = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(body.error || 'Import impossible');
            }

            const updated = body.updated ?? 0;
            const unmatched = body.unmatched ?? 0;
            toastSuccess(`${updated} film(s) mis à jour · ${unmatched} non trouvé(s)`);
            if (status) {
                status.textContent = `${updated} mis à jour, ${unmatched} non trouvés dans la collection.`;
            }

            if (typeof reload === 'function') {
                await reload();
            }
        } catch (err) {
            console.error(err);
            toastError(err.message || 'Erreur durant l’import');
            if (status) status.textContent = '';
        }
    });
}

export function initLetterboxdImport({ reload } = {}) {
    wireCsvImport({
        btnId: 'btn-letterboxd-watched',
        inputId: 'letterboxd-watched-input',
        status: null,
        parse: parseWatchedCsv,
        send: importLetterboxdWatches,
        loadingLabel: (n) => `Envoi de ${n} visionnages…`,
        reload,
    });

    wireCsvImport({
        btnId: 'btn-letterboxd-ratings',
        inputId: 'letterboxd-ratings-input',
        status: null,
        parse: parseRatingsCsv,
        send: importLetterboxdRatings,
        loadingLabel: (n) => `Envoi de ${n} notes…`,
        reload,
    });
}

export function initLetterboxdSortMenu() {
    const container = document.getElementById('letterboxd-sort-menu-container');
    const btn = document.getElementById('letterboxd-sort-btn');
    const menu = document.getElementById('letterboxd-sort-menu');
    const label = document.getElementById('letterboxd-sort-btn-label');
    const current = label?.querySelector('.sort-btn__current');
    if (!container || !btn || !menu || !current) return;

    const setLabel = (sortName) => {
        current.textContent = sortName;
    };

    const open = () => {
        container.classList.add('is-open');
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
        container.classList.remove('is-open');
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (container.classList.contains('is-open')) {
            close();
        } else {
            open();
        }
    });

    menu.querySelectorAll('.sort-menu__item').forEach((item) => {
        item.addEventListener('click', (event) => {
            event.stopPropagation();
            menu.querySelectorAll('.sort-menu__item').forEach((el) => {
                el.classList.remove('is-selected');
                el.setAttribute('aria-selected', 'false');
            });
            item.classList.add('is-selected');
            item.setAttribute('aria-selected', 'true');
            setLabel(item.textContent.trim());
            setLetterboxdSortMode(item.getAttribute('data-sort') || 'title');
            renderLetterboxd();
            close();
        });
    });

    document.addEventListener('click', (event) => {
        if (!container.contains(event.target)) {
            close();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && container.classList.contains('is-open')) {
            close();
        }
    });
}

function compareByTitle(a, b) {
    return String(a || '').localeCompare(String(b || ''), 'fr', { sensitivity: 'base' });
}

function sortLetterboxdFilms(films, mode) {
    return [...films].sort((a, b) => {
        if (mode === 'rating') {
            const ratingA = Number(a.user_rating) || 0;
            const ratingB = Number(b.user_rating) || 0;
            if (ratingB !== ratingA) return ratingB - ratingA;
            return compareByTitle(a.sort_title, b.sort_title);
        }

        if (mode === 'watched') {
            const dateA = a.last_watched_at || '';
            const dateB = b.last_watched_at || '';
            if (dateA && !dateB) return -1;
            if (!dateA && dateB) return 1;
            if (dateA !== dateB) return dateB.localeCompare(dateA);
            return compareByTitle(a.sort_title, b.sort_title);
        }

        return compareByTitle(a.sort_title, b.sort_title);
    });
}

export function renderLetterboxd() {
    const liste = document.getElementById('liste-letterboxd');
    if (!liste) return;

    clearElement(liste);

    const films = sortLetterboxdFilms(getFilms(), getLetterboxdSortMode());

    if (films.length === 0) {
        const li = document.createElement('li');
        li.style.gridColumn = '1 / -1';
        li.style.textAlign = 'center';
        li.style.padding = '50px';
        li.style.color = '#888';
        li.textContent = 'Aucun film dans la bibliothèque.';
        liste.appendChild(li);
        return;
    }

    films.forEach((film) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', '0');
        li.setAttribute('aria-label', film.title || 'Film');

        li.className = film.last_watched_at
            ? 'movie-card'
            : 'movie-card movie-card--unwatched';

        if (film.poster) {
            li.style.backgroundImage = `url("assets/images/small/${film.poster.replace(/"/g, '')}")`;
        }

        if (film.user_rating) {
            const ratingEl = document.createElement('div');
            ratingEl.className = 'movie-card__rating';
            if (appendRatingStars(ratingEl, film.user_rating)) {
                li.appendChild(ratingEl);
            }
        }

        const open = () => openMovieDetailsModal(film);
        li.addEventListener('click', open);
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });

        liste.appendChild(li);
    });
}
