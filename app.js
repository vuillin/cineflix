document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-ajout-film');
    const listeFilms = document.getElementById('liste-films');
    const btnSubmit = form ? form.querySelector('button[type="submit"]') : null;
    const btnDelete = document.getElementById('btn-delete');
    const detailsModal = document.getElementById('movie-details-modal');
    const closeDetailsBtn = document.getElementById('close-details-btn');
    const detailsMovieTitle = document.getElementById('details-movie-title');

    const editMovieModal = document.getElementById('edit-movie-modal');
    const formEditFilm = document.getElementById('form-edit-film');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const editModalBackdrop = document.querySelector('.edit-modal-backdrop');
    let currentEditingFilmFromModal = null;

    const navButtons = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');
    const subheaderCollection = document.getElementById('subheader-collection');
    const subheaderFavoris = document.getElementById('subheader-favoris');
    const accueilCategoriesContainer = document.getElementById('accueil-categories');
    const netflixHeader = document.getElementById('netflix-header');

    let currentView = 'view-accueil';
    window.addEventListener('scroll', () => {
        if (currentView === 'view-accueil' && window.scrollY < 50) {
            netflixHeader.classList.remove('scrolled');
        } else {
            netflixHeader.classList.add('scrolled');
        }
    });

    const btnAjouterFilm = document.getElementById('btn-ajouter-film');

    function switchView(targetId) {
        viewSections.forEach(section => section.classList.add('hidden'));

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        if (subheaderCollection) {
            if (targetId === 'view-collection') {
                subheaderCollection.classList.remove('hidden');
            } else {
                subheaderCollection.classList.add('hidden');
            }
        }

        if (subheaderFavoris) {
            if (targetId === 'view-favoris') {
                subheaderFavoris.classList.remove('hidden');
            } else {
                subheaderFavoris.classList.add('hidden');
            }
        }

        if (btnAjouterFilm) {
            if (targetId === 'view-collection') {
                btnAjouterFilm.classList.remove('hidden');
            } else {
                btnAjouterFilm.classList.add('hidden');
            }
        }

        currentView = targetId;
        if (targetId === 'view-accueil' && window.scrollY < 50) {
            netflixHeader.classList.remove('scrolled');
        } else {
            netflixHeader.classList.add('scrolled');
        }
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', (evenement) => {
            evenement.preventDefault();
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            switchView(btn.getAttribute('data-target'));
        });
    });

    switchView('view-accueil');

    let filmEnCoursDEdition = null;
    let allFilms = [];
    let currentGenreFilter = null;

    function openMovieDetailsModal(film) {
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
            document.getElementById('details-runtime').textContent = "Inconnue";
        }

        const matchScore = film.vote_average ? Math.round(film.vote_average * 10) : 75;
        document.getElementById('details-match').textContent = `Recommandé à ${matchScore}%`;

        let age_text = "TP";
        if (film.certification) {
            age_text = film.certification;
            if (age_text === "U") {
                age_text = "TP";
            }
            if (age_text !== "TP" && !age_text.includes('+') && !isNaN(age_text)) {
                age_text = age_text + "+";
            }
        } else {
            age_text = film.adult === 1 ? '18+' : '13+';
        }
        document.getElementById('details-age').textContent = age_text;

        const metaDvd = document.getElementById('details-meta-dvd');
        const metaBluray = document.getElementById('details-meta-bluray');
        const metaSteelbook = document.getElementById('details-meta-steelbook');
        const metaCoffret = document.getElementById('details-meta-coffret');

        if (metaDvd) metaDvd.classList.toggle('hidden', film.dvd != 1);
        if (metaBluray) metaBluray.classList.toggle('hidden', film.bluray != 1);
        if (metaSteelbook) metaSteelbook.classList.toggle('hidden', film.steelbook != 1);
        if (metaCoffret) metaCoffret.classList.toggle('hidden', film.coffret != 1);

        document.getElementById('details-overview').textContent = film.overview || "Aucun synopsis disponible pour ce titre.";
        document.getElementById('details-cast').textContent = film.cast_members || "Non renseigné";
        document.getElementById('details-director').textContent = film.director || "Inconnu";
        document.getElementById('details-genres').textContent = film.genres || "Non catégorisé";
        document.getElementById('details-production').textContent = film.production_companies || "Non renseigné";
        document.getElementById('details-composer').textContent = film.composer || "Inconnu";

        const posterUrl = film.poster ? `assets/images/small/${film.poster}` : '';
        const backdropUrl = film.backdrop ? `assets/images/backdrops/${film.backdrop}` : posterUrl;
        const headerBg = document.getElementById('details-header-bg');
        const posterImg = document.getElementById('details-poster');

        if (backdropUrl) {
            headerBg.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${backdropUrl}')`;
        } else {
            headerBg.style.backgroundImage = "none";
        }

        if (posterUrl) {
            posterImg.src = posterUrl;
            posterImg.style.display = 'block';
        } else {
            posterImg.style.display = 'none';
        }

        const btnModalFavorite = document.getElementById('btn-modal-favorite');
        if (btnModalFavorite) {
            if (film.is_favorite == 1) {
                btnModalFavorite.classList.add('liked');
            } else {
                btnModalFavorite.classList.remove('liked');
            }

            btnModalFavorite.onclick = async () => {
                const newState = (film.is_favorite == 1) ? 0 : 1;

                // L'API PUT attend l'objet film complet
                const updatedFilm = Object.assign({}, film, {
                    is_favorite: newState
                });

                try {
                    const response = await fetch('api.php', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedFilm)
                    });

                    if (response.ok) {
                        film.is_favorite = newState;

                        if (newState === 1) {
                            btnModalFavorite.classList.add('liked');
                        } else {
                            btnModalFavorite.classList.remove('liked');
                        }

                        allFilms = [];
                        chargerLesFilms();
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
            // onclick plutôt qu'addEventListener : évite de garder l'ancien film en mémoire
            btnModalDelete.onclick = async () => {
                if (confirm("Voulez-vous vraiment supprimer ce film de votre bibliothèque pour toujours ?")) {
                    try {
                        const reponse = await fetch('api.php', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: film.id })
                        });

                        if (reponse.ok) {
                            detailsModal.classList.add('hidden');
                            document.body.style.overflow = '';
                            allFilms = [];
                            chargerLesFilms();
                        } else {
                            console.error("L'API a refusé la suppression");
                        }
                    } catch (erreur) {
                        console.error("Erreur réseau :", erreur);
                    }
                }
            };
        }

        const btnModalEdit = document.getElementById('btn-modal-edit');
        if (btnModalEdit) {
            btnModalEdit.onclick = () => {
                const infoGrid = document.querySelector('.details-info-grid');
                const editGrid = document.querySelector('.details-edit-grid');

                if (infoGrid && editGrid) {
                    infoGrid.classList.add('fading-out');
                    editGrid.classList.remove('hidden-fade');

                    currentEditingFilmFromModal = film;
                    document.getElementById('inplace-edit-id').value = film.id;
                    document.getElementById('inplace-edit-tmdb-id').value = film.tmdb_id || '';
                    document.getElementById('inplace-edit-poster').value = film.poster ? film.poster.replace('.webp', '') : '';

                    const formatButtons = editGrid.querySelectorAll('.btn-format');
                    formatButtons.forEach(btn => {
                        const formatName = btn.getAttribute('data-format');
                        if (film[formatName] == 1) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
            };
        }

        const btnModalInplaceCancel = document.getElementById('btn-modal-inplace-cancel');
        if (btnModalInplaceCancel) {
            btnModalInplaceCancel.onclick = () => {
                const infoGrid = document.querySelector('.details-info-grid');
                const editGrid = document.querySelector('.details-edit-grid');

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
                let poster = formData.get('poster');

                if (poster && !poster.endsWith('.webp')) {
                    poster = poster.replace(/\.(png|jpe?g)$/i, '');
                    poster += '.webp';
                }

                const formatData = {};
                const formatButtons = formEditFilmInplace.querySelectorAll('.btn-format');
                formatButtons.forEach(btn => {
                    const formatName = btn.getAttribute('data-format');
                    formatData[formatName] = btn.classList.contains('active') ? 1 : 0;
                });

                const updatedFilm = Object.assign({}, currentEditingFilmFromModal, {
                    tmdb_id: tmdbId,
                    poster: poster
                }, formatData);

                try {
                    const response = await fetch('api.php', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedFilm)
                    });

                    if (response.ok) {
                        const infoGrid = document.querySelector('.details-info-grid');
                        const editGrid = document.querySelector('.details-edit-grid');
                        const currentModalImg = detailsModal.querySelector('.details-poster-container img');

                        if (currentModalImg && poster) {
                            currentModalImg.src = `assets/img/affiches/${poster}`;
                        }

                        Object.assign(film, updatedFilm);

                        const metaDvd = document.getElementById('details-meta-dvd');
                        const metaBluray = document.getElementById('details-meta-bluray');
                        const metaSteelbook = document.getElementById('details-meta-steelbook');
                        const metaCoffret = document.getElementById('details-meta-coffret');

                        if (metaDvd) metaDvd.classList.toggle('hidden', updatedFilm.dvd != 1);
                        if (metaBluray) metaBluray.classList.toggle('hidden', updatedFilm.bluray != 1);
                        if (metaSteelbook) metaSteelbook.classList.toggle('hidden', updatedFilm.steelbook != 1);
                        if (metaCoffret) metaCoffret.classList.toggle('hidden', updatedFilm.coffret != 1);

                        if (infoGrid && editGrid) {
                            editGrid.classList.add('hidden-fade');
                            infoGrid.classList.remove('fading-out');
                        }

                        allFilms = [];
                        chargerLesFilms();
                    } else {
                        console.error("L'API a refusé l'édition");
                    }
                } catch (err) {
                    console.error("Erreur réseau (Edition)", err);
                }
            };
        }

        detailsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    chargerLesFilms();

    async function chargerLesFilms() {
        try {
            if (allFilms.length === 0) {
                const reponse = await fetch('api.php');
                allFilms = await reponse.json();
            }

            const films = allFilms;

            let genreCounts = {};
            allFilms.forEach((film, index) => {
                if (film.genres) {
                    let lesGenresDuFilm = film.genres.split(',').map(g => g.trim());
                    lesGenresDuFilm.forEach(g => {
                        // TMDB alterne entre "Science-Fiction" et "Science Fiction"
                        let nomGenreHomogeneise = g;
                        if (g === "Science Fiction") nomGenreHomogeneise = "Science-Fiction";

                        genreCounts[nomGenreHomogeneise] = (genreCounts[nomGenreHomogeneise] || 0) + 1;
                    });
                }
            });

            const genreCards = document.querySelectorAll('.genre-card:not(.return-card)');
            genreCards.forEach(card => {
                const genreName = card.getAttribute('data-value');
                const count = genreCounts[genreName] || 0;
                const pText = card.querySelector('p');
                if (pText) {
                    pText.textContent = `${count} film${count > 1 ? 's' : ''} dans la bibliothèque`;
                }
            });

            listeFilms.innerHTML = '';

            let filmsAafficher = films;
            if (currentGenreFilter) {
                filmsAafficher = films.filter(film => {
                    if (!film.genres) return false;
                    const genresDuFilm = film.genres.split(',').map(g => g.trim());

                    if (currentGenreFilter === "Science-Fiction") {
                        return genresDuFilm.includes("Science-Fiction") || genresDuFilm.includes("Science Fiction");
                    }
                    return genresDuFilm.includes(currentGenreFilter);
                });
            }
            if (filmsAafficher.length === 0) {
                if (currentGenreFilter) {
                    listeFilms.innerHTML = `<li>Aucun film trouvé pour le genre ${currentGenreFilter}.</li>`;
                } else {
                    listeFilms.innerHTML = '<li>Aucun film enregistré pour le moment.</li>';
                }
                return;
            }

            let categorieEnCours = '';

            filmsAafficher.forEach(film => {
                let firstChar = film.sort_title.charAt(0).toUpperCase();
                let category = '';

                if (firstChar >= 'D' && firstChar <= 'F') category = 'D-F';
                else if (firstChar >= 'G' && firstChar <= 'I') category = 'G-I';
                else if (firstChar >= 'J' && firstChar <= 'L') category = 'J-L';
                else if (firstChar >= 'M' && firstChar <= 'O') category = 'M-O';
                else if (firstChar >= 'P' && firstChar <= 'R') category = 'P-R';
                else if (firstChar >= 'S' && firstChar <= 'U') category = 'S-U';
                else if (firstChar >= 'V' && firstChar <= 'X') category = 'V-X';
                else if (firstChar >= 'Y' && firstChar <= 'Z') category = 'Y-Z';
                else category = 'A-C';

                if (category !== categorieEnCours) {
                    const separator = document.createElement('li');
                    separator.className = 'letter-separator';
                    separator.innerHTML = `<h2>${category}</h2>`;
                    listeFilms.appendChild(separator);
                    categorieEnCours = category;
                }

                const li = document.createElement('li');
                li.className = 'movie-card';

                if (film.poster) {
                    li.style.backgroundImage = `url('assets/images/small/${film.poster}')`;
                }

                li.style.cursor = 'pointer';
                li.addEventListener('click', () => {
                    openMovieDetailsModal(film);
                });

                listeFilms.appendChild(li);
            });

            if (accueilCategoriesContainer && accueilCategoriesContainer.innerHTML.trim() === '') {
                renderAccueil(allFilms);
            }

            const listeFavoris = document.getElementById('liste-favoris');
            if (listeFavoris) {
                listeFavoris.innerHTML = '';

                const filmsFavoris = allFilms.filter(film => film.is_favorite == 1);

                if (filmsFavoris.length === 0) {
                    listeFavoris.innerHTML = '<li style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #888;">Vous n\'avez pas encore de favoris. Cliquez sur le cœur d\'un film pour l\'ajouter.</li>';
                } else {
                    filmsFavoris.forEach(film => {
                        const li = document.createElement('li');
                        li.className = 'movie-card';

                        if (film.poster) {
                            li.style.backgroundImage = `url('assets/images/small/${film.poster}')`;
                        }

                        li.style.cursor = 'pointer';
                        li.addEventListener('click', () => {
                            openMovieDetailsModal(film);
                        });

                        listeFavoris.appendChild(li);
                    });
                }
            }

        } catch (erreur) {
            console.error("Erreur de récupération :", erreur);
            listeFilms.innerHTML = '<li>Erreur de communication avec le serveur.</li>';
        }
    }

    btnDelete.addEventListener('click', async () => {
        if (!filmEnCoursDEdition) return;

        if (confirm("Voulez-vous vraiment supprimer ce film pour toujours ?")) {
            try {
                const reponse = await fetch('api.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: filmEnCoursDEdition })
                });

                if (reponse.ok) {
                    form.reset();
                    sectionAjout.classList.add('hidden');
                    btnDelete.classList.add('hidden');
                    filmEnCoursDEdition = null;
                    allFilms = [];
                    chargerLesFilms();
                } else {
                    console.error("L'API a refusé la suppression");
                }
            } catch (erreur) {
                console.error("Erreur réseau :", erreur);
            }
        }
    });

    form.addEventListener('submit', async (evenement) => {
        evenement.preventDefault();

        const formData = new FormData(form);
        const donnees = Object.fromEntries(formData.entries());

        if (donnees.poster && !donnees.poster.endsWith('.webp')) {
            donnees.poster = donnees.poster.replace(/\.(png|jpe?g)$/i, '');
            donnees.poster += '.webp';
        }

        let method = 'POST';
        if (filmEnCoursDEdition) {
            donnees.id = filmEnCoursDEdition;
            method = 'PUT';
        }

        try {
            const reponse = await fetch('api.php', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donnees)
            });

            if (reponse.ok) {
                form.reset();
                sectionAjout.classList.add('hidden');
                filmEnCoursDEdition = null;
                titleForm.textContent = 'Ajouter un nouveau film';
                btnSubmit.textContent = 'Enregistrer le film';
                btnDelete.classList.add('hidden');

                chargerLesFilms();
            } else {
                console.error("L'API a renvoyé une erreur");
            }
        } catch (erreur) {
            console.error("Erreur de connexion :", erreur);
        }
    });

    const genreBtn = document.getElementById('genre-btn');
    const genreModal = document.getElementById('genre-modal');
    const closeGenreModalBtn = document.getElementById('close-genre-modal');

    const openGenreModal = () => {
        if (genreModal && genreBtn) {
            genreModal.classList.remove('hidden-modal');
            document.body.style.overflow = 'hidden';

            const arrow = genreBtn.querySelector('.arrow-down');
            if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
    };

    const closeGenreModal = () => {
        if (genreModal && genreBtn) {
            genreModal.classList.add('hidden-modal');
            document.body.style.overflow = '';

            const arrow = genreBtn.querySelector('.arrow-down');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
    };

    if (genreBtn && genreModal && closeGenreModalBtn) {
        genreBtn.addEventListener('click', openGenreModal);
        closeGenreModalBtn.addEventListener('click', closeGenreModal);

        genreModal.addEventListener('click', (e) => {
            if (e.target === genreModal) {
                closeGenreModal();
            }
        });

        const genreOptions = document.querySelectorAll('.genre-card:not(.return-card)');
        genreOptions.forEach(option => {
            option.addEventListener('click', () => {
                const genreSelectionne = option.getAttribute('data-value');

                currentGenreFilter = genreSelectionne;
                chargerLesFilms();

                const pageTitle = document.querySelector('.page-title');
                if (pageTitle) {
                    pageTitle.innerHTML = `<span class="breadcrumb clickable" id="reset-genre-breadcrumb">Films &gt;</span> ${genreSelectionne}`;

                    document.getElementById('reset-genre-breadcrumb').addEventListener('click', () => {
                        currentGenreFilter = null;
                        chargerLesFilms();
                        pageTitle.textContent = "Films";
                    });
                }

                closeGenreModal();
            });
        });

        if (closeGenreModalBtn) {
            closeGenreModalBtn.addEventListener('click', () => {
                if (currentGenreFilter !== null) {
                    currentGenreFilter = null;
                    chargerLesFilms();
                    const pageTitle = document.querySelector('.page-title');
                    if (pageTitle) pageTitle.textContent = "Films";
                }
                closeGenreModal();
            });
        }
    }

    function renderAccueil(filmsData) {
        if (!accueilCategoriesContainer) return;
        accueilCategoriesContainer.innerHTML = '';

        const heroImages = [
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
        const heroBanner = document.getElementById('hero-banner');
        if (heroBanner && heroImages.length > 0) {
            const heroParam = new URLSearchParams(window.location.search).get('hero');
            let heroIndex = (heroParam !== null && heroParam >= 0 && heroParam < heroImages.length)
                ? parseInt(heroParam)
                : Math.floor(Math.random() * heroImages.length);

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
                heroActions.innerHTML = '';
                const filmHero = allFilms.find(f => f.tmdb_id == entry.tmdbId);
                if (filmHero) {
                    const btnInfo = document.createElement('button');
                    btnInfo.className = 'btn-hero-info';
                    btnInfo.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                            <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                        </svg>
                        Plus d'infos
                    `;
                    btnInfo.addEventListener('click', () => openMovieDetailsModal(filmHero));
                    heroActions.appendChild(btnInfo);
                }
            }

            function showHero(index) {
                const entry = heroImages[index];

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

            layerA.style.zIndex = '1';
            layerB.style.zIndex = '2';
            layerB.style.backgroundImage = `url('assets/images/heroes/${heroImages[heroIndex].image}')`;
            layerB.style.opacity = '1';
            layerA.style.opacity = '1';
            updateButton(heroImages[heroIndex]);

            if (heroParam === null) {
                setInterval(() => {
                    heroIndex = (heroIndex + 1) % heroImages.length;
                    showHero(heroIndex);
                }, 15000);
            }
        }


        const categoriesAffichees = getRandomCategories(filmsData, 10, 4);

        if (categoriesAffichees.length === 0) {
            accueilCategoriesContainer.innerHTML = "<p style='padding: 2rem; color: white;'>Oups... Pas assez de films dans la bibliothèque pour générer un accueil digne de ce nom. Ajoutez plus d'informations !</p>";
            return;
        }

        categoriesAffichees.forEach((categorie, index) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'netflix-row';

            const headerRow = document.createElement('h2');
            headerRow.className = 'row-title';
            headerRow.textContent = categorie.titre;
            rowDiv.appendChild(headerRow);

            const sliderWrapper = document.createElement('div');
            sliderWrapper.className = 'row-posters';

            categorie.films.forEach(film => {
                const imgCard = document.createElement('div');
                imgCard.className = 'movie-poster-card';

                if (film.poster) {
                    imgCard.style.backgroundImage = `url('assets/images/small/${film.poster}')`;
                } else {
                    imgCard.style.backgroundColor = '#333';
                    imgCard.style.display = 'flex';
                    imgCard.style.alignItems = 'center';
                    imgCard.style.justifyContent = 'center';
                    imgCard.style.textAlign = 'center';
                    imgCard.innerHTML = `<span style="color:white; padding:10px; font-size:0.8rem">${film.title}</span>`;
                }

                imgCard.addEventListener('click', () => {
                    openMovieDetailsModal(film);
                });

                sliderWrapper.appendChild(imgCard);
            });

            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';

            const leftHandle = document.createElement('div');
            leftHandle.className = 'handle left-handle';
            leftHandle.innerHTML = '<span class="arrow-icon">&#8249;</span>';
            leftHandle.addEventListener('click', () => {
                sliderWrapper.scrollBy({ left: -(sliderWrapper.clientWidth * 0.8), behavior: 'smooth' });
            });
            sliderContainer.appendChild(leftHandle);

            const rightHandle = document.createElement('div');
            rightHandle.className = 'handle right-handle';
            rightHandle.innerHTML = '<span class="arrow-icon">&#8250;</span>';
            rightHandle.addEventListener('click', () => {
                sliderWrapper.scrollBy({ left: sliderWrapper.clientWidth * 0.8, behavior: 'smooth' });
            });
            sliderContainer.appendChild(rightHandle);

            sliderContainer.appendChild(sliderWrapper);
            rowDiv.appendChild(sliderContainer);

            const updateArrowVisibility = () => {
                if (sliderWrapper.scrollLeft <= 2) {
                    leftHandle.classList.add('handle-hidden');
                } else {
                    leftHandle.classList.remove('handle-hidden');
                }

                if (sliderWrapper.scrollLeft + sliderWrapper.clientWidth >= sliderWrapper.scrollWidth - 2) {
                    rightHandle.classList.add('handle-hidden');
                } else {
                    rightHandle.classList.remove('handle-hidden');
                }
            };

            sliderWrapper.addEventListener('scroll', updateArrowVisibility);
            window.addEventListener('resize', updateArrowVisibility);
            setTimeout(updateArrowVisibility, 150);
            accueilCategoriesContainer.appendChild(rowDiv);
        });
    }


    closeDetailsBtn.addEventListener('click', () => {
        detailsModal.classList.add('hidden');
        document.body.style.overflow = '';
    });

    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            detailsModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    if (editMovieModal) {
        const closeEditModal = () => {
            editMovieModal.classList.add('hidden-modal');
        };

        if (btnCancelEdit) btnCancelEdit.addEventListener('click', closeEditModal);
        if (editModalBackdrop) editModalBackdrop.addEventListener('click', closeEditModal);

        if (formEditFilm) {
            formEditFilm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const formData = new FormData(formEditFilm);
                const tmdbId = formData.get('tmdb_id');
                let poster = formData.get('poster');

                if (poster && !poster.endsWith('.webp')) {
                    poster = poster.replace(/\.(png|jpe?g)$/i, '');
                    poster += '.webp';
                }

                const updatedFilm = Object.assign({}, currentEditingFilmFromModal, {
                    tmdb_id: tmdbId,
                    poster: poster
                });

                try {
                    const response = await fetch('api.php', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedFilm)
                    });

                    if (response.ok) {
                        closeEditModal();
                        detailsModal.classList.add('hidden');
                        document.body.style.overflow = '';
                        allFilms = [];
                        chargerLesFilms();
                    } else {
                        console.error("L'API a refusé la modification.");
                    }
                } catch (err) {
                    console.error("Erreur réseau lors de l'édition :", err);
                }
            });
        }
    }

    const formatButtons = document.querySelectorAll('.btn-format');
    formatButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btn.classList.toggle('active');
        });
    });

});
