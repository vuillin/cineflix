let allFilms = [];
let currentGenreFilter = null;
let searchQuery = '';
let sortMode = 'title';
let accueilRendered = false;

export function getFilms() {
    return allFilms;
}

export function setFilms(films) {
    allFilms = films;
}

export function invalidateFilms() {
    allFilms = [];
}

export function isAccueilRendered() {
    return accueilRendered;
}

export function markAccueilRendered() {
    accueilRendered = true;
}

export function getGenreFilter() {
    return currentGenreFilter;
}

export function setGenreFilter(genre) {
    currentGenreFilter = genre;
}

export function getSearchQuery() {
    return searchQuery;
}

export function setSearchQuery(query) {
    searchQuery = typeof query === 'string' ? query : '';
}

export function clearSearchQuery() {
    searchQuery = '';
}

export function getSortMode() {
    return sortMode;
}

export function setSortMode(mode) {
    const allowed = ['title', 'year', 'rating'];
    sortMode = allowed.includes(mode) ? mode : 'title';
}
