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

export function homogenizeGenre(name) {
    return name === 'Science Fiction' ? 'Science-Fiction' : name;
}
