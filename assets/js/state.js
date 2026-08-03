let allFilms = [];
let currentGenreFilter = null;
let filmEnCoursDEdition = null;
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

export function getEditingFilmId() {
    return filmEnCoursDEdition;
}

export function setEditingFilmId(id) {
    filmEnCoursDEdition = id;
}
