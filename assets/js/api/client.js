const API_URL = 'api.php';

function apiToken() {
    return (window.__CINEFLIX__ && window.__CINEFLIX__.apiToken) || '';
}

function writeHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-Cineflix-Token': apiToken(),
    };
}

export async function fetchMovies() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Impossible de charger les films');
    }
    return response.json();
}

export async function createMovie(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: writeHeaders(),
        body: JSON.stringify(data),
    });
    return response;
}

export async function updateMovie(data) {
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: writeHeaders(),
        body: JSON.stringify(data),
    });
    return response;
}

export async function updateFavorite(id, isFavorite) {
    const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: writeHeaders(),
        body: JSON.stringify({ id, is_favorite: isFavorite }),
    });
    return response;
}

export async function deleteMovie(id) {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: writeHeaders(),
        body: JSON.stringify({ id }),
    });
    return response;
}

export async function fetchTmdbPreview(tmdbId, { signal } = {}) {
    const response = await fetch(`${API_URL}?tmdb_preview=${encodeURIComponent(tmdbId)}`, {
        signal,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(body.error || 'Preview TMDB impossible');
        error.status = response.status;
        throw error;
    }

    return body;
}
