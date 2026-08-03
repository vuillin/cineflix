import { getRandomCategories } from '../categories.js';
import { getFilms } from '../state.js';
import { clearElement } from '../utils/dom.js';
import { openMovieDetailsModal } from './details-modal.js';

const HERO_IMAGES = [
    { image: 'hero_1.webp', tmdbId: 85 },
    { image: 'hero_2.webp', tmdbId: 312221 },
    { image: 'hero_3.webp', tmdbId: 155 },
    { image: 'hero_4.webp', tmdbId: 1891 },
    { image: 'hero_5.webp', tmdbId: 27205 },
    { image: 'hero_6.webp', tmdbId: 76341 },
    { image: 'hero_7.webp', tmdbId: 329 },
    { image: 'hero_8.webp', tmdbId: 603 },
    { image: 'hero_9.webp', tmdbId: 238 },
    { image: 'hero_10.webp', tmdbId: 105 },
    { image: 'hero_11.webp', tmdbId: 1366 },
    { image: 'hero_12.webp', tmdbId: 120 },
    { image: 'hero_13.webp', tmdbId: 1091 },
];

let heroInitialized = false;

export function renderAccueil(filmsData) {
    const accueilCategoriesContainer = document.getElementById('accueil-categories');
    if (!accueilCategoriesContainer) return;

    clearElement(accueilCategoriesContainer);
    initHero();

    const categoriesAffichees = getRandomCategories(filmsData, 10, 4);

    if (categoriesAffichees.length === 0) {
        const p = document.createElement('p');
        p.style.padding = '2rem';
        p.style.color = 'white';
        p.textContent = "Oups... Pas assez de films dans la bibliothèque pour générer un accueil digne de ce nom. Ajoutez plus d'informations !";
        accueilCategoriesContainer.appendChild(p);
        return;
    }

    categoriesAffichees.forEach((categorie) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'netflix-row';

        const headerRow = document.createElement('h2');
        headerRow.className = 'row-title';
        headerRow.textContent = categorie.titre;
        rowDiv.appendChild(headerRow);

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'row-posters';

        categorie.films.forEach((film) => {
            const imgCard = document.createElement('div');
            imgCard.className = 'movie-poster-card';
            imgCard.setAttribute('role', 'button');
            imgCard.setAttribute('tabindex', '0');
            imgCard.setAttribute('aria-label', film.title || 'Film');

            if (film.poster) {
                imgCard.style.backgroundImage = `url("assets/images/small/${film.poster.replace(/"/g, '')}")`;
            } else {
                imgCard.style.backgroundColor = '#333';
                imgCard.style.display = 'flex';
                imgCard.style.alignItems = 'center';
                imgCard.style.justifyContent = 'center';
                imgCard.style.textAlign = 'center';
                const span = document.createElement('span');
                span.style.color = 'white';
                span.style.padding = '10px';
                span.style.fontSize = '0.8rem';
                span.textContent = film.title;
                imgCard.appendChild(span);
            }

            const open = () => openMovieDetailsModal(film);
            imgCard.addEventListener('click', open);
            imgCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open();
                }
            });

            sliderWrapper.appendChild(imgCard);
        });

        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';

        const leftHandle = document.createElement('div');
        leftHandle.className = 'handle left-handle';
        leftHandle.setAttribute('role', 'button');
        leftHandle.setAttribute('aria-label', 'Défiler vers la gauche');
        const leftIcon = document.createElement('span');
        leftIcon.className = 'arrow-icon';
        leftIcon.innerHTML = '&#8249;';
        leftHandle.appendChild(leftIcon);
        leftHandle.addEventListener('click', () => {
            sliderWrapper.scrollBy({ left: -(sliderWrapper.clientWidth * 0.8), behavior: 'smooth' });
        });
        sliderContainer.appendChild(leftHandle);

        const rightHandle = document.createElement('div');
        rightHandle.className = 'handle right-handle';
        rightHandle.setAttribute('role', 'button');
        rightHandle.setAttribute('aria-label', 'Défiler vers la droite');
        const rightIcon = document.createElement('span');
        rightIcon.className = 'arrow-icon';
        rightIcon.innerHTML = '&#8250;';
        rightHandle.appendChild(rightIcon);
        rightHandle.addEventListener('click', () => {
            sliderWrapper.scrollBy({ left: sliderWrapper.clientWidth * 0.8, behavior: 'smooth' });
        });
        sliderContainer.appendChild(rightHandle);

        sliderContainer.appendChild(sliderWrapper);
        rowDiv.appendChild(sliderContainer);

        const updateArrowVisibility = () => {
            leftHandle.classList.toggle('handle-hidden', sliderWrapper.scrollLeft <= 2);
            rightHandle.classList.toggle(
                'handle-hidden',
                sliderWrapper.scrollLeft + sliderWrapper.clientWidth >= sliderWrapper.scrollWidth - 2
            );
        };

        sliderWrapper.addEventListener('scroll', updateArrowVisibility);
        window.addEventListener('resize', updateArrowVisibility);
        setTimeout(updateArrowVisibility, 150);
        accueilCategoriesContainer.appendChild(rowDiv);
    });
}

function initHero() {
    if (heroInitialized) return;
    const heroBanner = document.getElementById('hero-banner');
    if (!heroBanner || HERO_IMAGES.length === 0) return;
    heroInitialized = true;

    const heroParam = new URLSearchParams(window.location.search).get('hero');
    let heroIndex = (heroParam !== null && heroParam >= 0 && heroParam < HERO_IMAGES.length)
        ? parseInt(heroParam, 10)
        : Math.floor(Math.random() * HERO_IMAGES.length);

    const layerA = document.createElement('div');
    const layerB = document.createElement('div');
    layerA.className = 'hero-layer';
    layerB.className = 'hero-layer';
    layerA.style.zIndex = '1';
    layerB.style.zIndex = '2';
    heroBanner.appendChild(layerA);
    heroBanner.appendChild(layerB);

    const heroActions = document.createElement('div');
    heroActions.className = 'hero-actions';
    heroBanner.appendChild(heroActions);

    let showingB = true;

    function updateButton(entry) {
        clearElement(heroActions);
        const filmHero = getFilms().find((f) => f.tmdb_id == entry.tmdbId);
        if (!filmHero) return;

        const btnInfo = document.createElement('button');
        btnInfo.className = 'btn-hero-info';
        btnInfo.setAttribute('aria-label', `Plus d'infos sur ${filmHero.title}`);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('height', '24px');
        svg.setAttribute('viewBox', '0 -960 960 960');
        svg.setAttribute('width', '24px');
        svg.setAttribute('fill', 'currentColor');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z');
        svg.appendChild(path);
        btnInfo.appendChild(svg);
        btnInfo.appendChild(document.createTextNode(" Plus d'infos"));
        btnInfo.addEventListener('click', () => openMovieDetailsModal(filmHero));
        heroActions.appendChild(btnInfo);
    }

    function showHero(index) {
        const entry = HERO_IMAGES[index];
        if (showingB) {
            layerA.style.backgroundImage = `url('assets/images/heroes/${entry.image}')`;
            layerB.style.opacity = '0';
            showingB = false;
        } else {
            layerB.style.backgroundImage = `url('assets/images/heroes/${entry.image}')`;
            layerB.style.opacity = '1';
            showingB = true;
        }
        updateButton(entry);
    }

    layerB.style.backgroundImage = `url('assets/images/heroes/${HERO_IMAGES[heroIndex].image}')`;
    layerB.style.opacity = '1';
    layerA.style.opacity = '1';
    updateButton(HERO_IMAGES[heroIndex]);

    if (heroParam === null) {
        setInterval(() => {
            heroIndex = (heroIndex + 1) % HERO_IMAGES.length;
            showHero(heroIndex);
        }, 15000);
    }
}
