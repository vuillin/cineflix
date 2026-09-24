export function clearElement(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

export function setEmptyListMessage(listEl, message) {
    clearElement(listEl);
    const li = document.createElement('li');
    li.textContent = message;
    listEl.appendChild(li);
}

export function normalizePosterFilename(poster) {
    if (!poster) return poster;
    let value = String(poster);
    if (!value.endsWith('.webp')) {
        value = value.replace(/\.(png|jpe?g)$/i, '');
        value += '.webp';
    }
    return value;
}

export function posterUrl(poster) {
    return poster ? `assets/images/small/${poster}` : '';
}

export function backdropUrl(backdrop, fallbackPoster) {
    if (backdrop) return `assets/images/backdrops/${backdrop}`;
    return posterUrl(fallbackPoster);
}

export function letterCategory(sortTitle) {
    const firstChar = (sortTitle || '').charAt(0).toUpperCase();
    if (firstChar >= 'D' && firstChar <= 'F') return 'D-F';
    if (firstChar >= 'G' && firstChar <= 'I') return 'G-I';
    if (firstChar >= 'J' && firstChar <= 'L') return 'J-L';
    if (firstChar >= 'M' && firstChar <= 'O') return 'M-O';
    if (firstChar >= 'P' && firstChar <= 'R') return 'P-R';
    if (firstChar >= 'S' && firstChar <= 'U') return 'S-U';
    if (firstChar >= 'V' && firstChar <= 'X') return 'V-X';
    if (firstChar >= 'Y' && firstChar <= 'Z') return 'Y-Z';
    return 'A-C';
}

export function normalizeSearchText(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

export function filmMatchesSearch(film, query) {
    const needle = normalizeSearchText(query);
    if (!needle) return true;

    const haystack = [
        film.title,
        film.original_title,
        film.director,
        film.cast_members,
    ]

        .map(normalizeSearchText)
        .join(' ');

    return haystack.includes(needle);
}

export function decadeCategory(year) {
    const y = Number(year);
    if (!y) return 'Inconnue';
    return String(Math.floor(y / 10) * 10); // 1987 → "1980"
}

export function ratingCategory(voteAverage) {
    const score = Number(voteAverage);
    if (!score || score <= 0) return 'Non noté';

    const bucket = Math.min(10, Math.floor(score));
    if (bucket === 10) return '10.0';
    return `${bucket}.0 - ${bucket}.9`;
}

const FORMAT_ORDER = ['steelbook', 'coffret', 'bluray', 'dvd'];

const FORMAT_LABELS = {
    steelbook: 'Steelbook',
    coffret: 'Coffret',
    bluray: 'Blu-ray',
    dvd: 'DVD',
};

export function expandFilmByFormats(film) {
    const entries = [];

    FORMAT_ORDER.forEach((key, rank) => {
        if (film[key] == 1) {
            entries.push({
                film,
                category: FORMAT_LABELS[key],
                rank,
            });
        }
    });

    if (entries.length === 0) {
        entries.push({
            film,
            category: 'Sans format',
            rank: FORMAT_ORDER.length,
        });
    }

    return entries;
}


