<div id="movie-details-modal" class="details-modal hidden">
    <div class="details-modal-content">
        <button id="close-details-btn" class="close-btn" aria-label="Fermer la fiche film">&times;</button>

        <div class="details-header" id="details-header-bg">
            <div class="details-header-fade"></div>
            <img src="" alt="Poster" id="details-poster" class="details-poster-img">
        </div>

        <div class="details-body">
            <h2 id="details-movie-title" class="details-title">Titre du film</h2>

            <div class="details-meta">
                <span id="details-match" class="meta-match">Recommandé à 98%</span>
                <span id="details-year" class="meta-year">2023</span>
                <span id="details-age" class="meta-age">16+</span>
                <span id="details-runtime" class="meta-runtime">2h 15m</span>
                <span id="details-meta-dvd" class="meta-format hidden">DVD</span>
                <span id="details-meta-bluray" class="meta-format hidden">BLU-RAY</span>
                <span id="details-meta-steelbook" class="meta-format hidden">STEELBOOK</span>
                <span id="details-meta-coffret" class="meta-format hidden">COFFRET</span>
            </div>

            <div class="details-transition-container">
                <div class="details-info-grid">
                    <div class="details-main-info">
                        <p id="details-overview" class="details-overview">Un synopsis captivant...</p>
                    </div>
                    <div class="details-side-info">
                        <p><strong>Distribution :</strong> <span id="details-cast">Acteur 1, Acteur 2</span></p>
                        <p><strong>Réalisateur :</strong> <span id="details-director">Réalisateur</span></p>
                        <p><strong>Genres :</strong> <span id="details-genres">Action, Aventure</span></p>

                        <div class="details-actions">
                            <button class="btn-icon favorite-btn" title="Ajouter aux favoris" id="btn-modal-favorite">
                                <svg class="heart-empty" xmlns="http://www.w3.org/2000/svg" height="24px"
                                    viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                                    <path
                                        d="m480-173.85-30.31-27.38q-97.92-89.46-162-153.15-64.07-63.7-101.15-112.35-37.08-48.65-51.81-88.04Q120-594.15 120-634q0-76.31 51.85-128.15Q223.69-814 300-814q52.77 0 99 27t81 78.54Q514.77-760 561-787q46.23-27 99-27 76.31 0 128.15 51.85Q840-710.31 840-634q0 39.85-14.73 79.23-14.73 39.39-51.81 88.04-37.08 48.65-100.77 112.35Q609-290.69 510.31-201.23L480-173.85Zm0-54.15q96-86.77 158-148.65 62-61.89 98-107.39t50-80.61q14-35.12 14-69.35 0-60-40-100t-100-40q-47.77 0-88.15 27.27-40.39 27.27-72.31 82.11h-39.08q-32.69-55.61-72.69-82.5Q347.77-774 300-774q-59.23 0-99.62 40Q160-694 160-634q0 34.23 14 69.35 14 35.11 50 80.61t98 107q62 61.5 158 149.04Zm0-273Z" />
                                </svg>
                                <svg class="heart-full" xmlns="http://www.w3.org/2000/svg" height="24px"
                                    viewBox="0 -960 960 960" width="24px" fill="#ff4b4b">
                                    <path
                                        d="m480-173.85-30.31-27.38q-97.92-89.46-162-153.15-64.07-63.7-101.15-112.35-37.08-48.65-51.81-88.04Q120-594.15 120-634q0-76.31 51.85-128.15Q223.69-814 300-814q52.77 0 99 27t81 78.54Q514.77-760 561-787q46.23-27 99-27 76.31 0 128.15 51.85Q840-710.31 840-634q0 39.85-14.73 79.23-14.73 39.39-51.81 88.04-37.08 48.65-100.77 112.35Q609-290.69 510.31-201.23L480-173.85Z" />
                                </svg>
                            </button>
                            <button class="btn-icon" title="Modifier ce film" id="btn-modal-edit">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#e3e3e3">
                                    <path
                                        d="M200-200h43.92l427.93-427.92-43.93-43.93L200-243.92V-200Zm-40 40v-100.77l527.23-527.77q6.15-5.48 13.57-8.47 7.43-2.99 15.49-2.99t15.62 2.54q7.55 2.54 13.94 9.15l42.69 42.93q6.61 6.38 9.04 14 2.42 7.63 2.42 15.25 0 8.13-2.74 15.56-2.74 7.42-8.72 13.57L260.77-160H160Zm600.77-556.31-44.46-44.46 44.46 44.46ZM649.5-649.5l-21.58-22.35 43.93 43.93-22.35-21.58Z" />
                                </svg>
                            </button>
                            <button class="btn-icon" title="Supprimer ce film" id="btn-modal-delete">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#e3e3e3">
                                    <path
                                        d="M304.62-160q-26.85 0-45.74-18.88Q240-197.77 240-224.62V-720h-40v-40h160v-30.77h240V-760h160v40h-40v495.38q0 27.62-18.5 46.12Q683-160 655.38-160H304.62ZM680-720H280v495.38q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h350.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93V-720ZM392.31-280h40v-360h-40v360Zm135.38 0h40v-360h-40v360ZM280-720v520-520Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="details-edit-grid hidden-fade" id="details-edit-grid">
                    <form id="form-edit-film-inplace" autocomplete="off">
                        <input type="hidden" id="inplace-edit-id" name="id">

                        <div class="edit-row">
                            <div class="form-group-inplace form-group-small">
                                <label for="inplace-edit-tmdb-id">ID TMDB</label>
                                <input type="text" id="inplace-edit-tmdb-id" name="tmdb_id" placeholder="Ex: 550">
                            </div>

                            <div class="form-group-inplace form-group-large">
                                <label for="inplace-edit-poster">AFFICHE</label>
                                <input type="text" id="inplace-edit-poster" name="poster"
                                    placeholder="Ex: fight_club">
                            </div>

                            <div class="form-group-inplace form-group-formats">
                                <label style="visibility: hidden;">FORMATS</label>
                                <div class="formats-buttons-row">
                                    <button type="button" class="btn-icon btn-format" data-format="dvd" title="DVD">
                                        <svg width="24px" height="24px" viewBox="0 0 1058.4 465.84" fill="#e3e3e3"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g>
                                                <path
                                                    d="m91.053 0-13.719 57.707 102.28 0.039063h24c65.747 0 105.91 26.44 94.746 73.4-12.147 51.133-69.613 73.4-130.67 73.4h-22.947l29.787-125.45h-102.27l-43.521 183.2h145.05c109.07 0 212.76-57.573 231.01-131.15 3.3467-13.507 2.8806-47.253-5.3594-67.359-0.21299-0.787-0.42594-1.4-1.1855-3-0.293-0.653-0.56012-3.6412 1.1465-4.2812 0.947-0.36 2.7069 1.4944 2.9336 2.041 0.853 2.24 1.5059 3.9062 1.5059 3.9062l92.293 260.6 234.97-265.21 99.535-0.089844h24c65.76 0 106.25 26.44 95.092 73.4-12.147 51.133-69.947 73.4-131 73.4h-22.959l29.799-125.47h-102.27l-43.533 183.21h145.07c109.05 0 213.48-57.4 231-131.15 17.52-73.75-59.107-131.15-168.69-131.15h-216.4s-57.319 67.88-67.959 80.693c-57.12 68.787-67.241 87.226-68.961 91.986 0.24-4.8-1.8138-23.412-26.174-92.959-6.48-18.52-27.359-79.721-27.359-79.721h-389.25zm408.77 324.16c-276.04 0-499.83 31.72-499.83 70.84s223.79 70.84 499.83 70.84c276.04 0 499.83-31.72 499.83-70.84s-223.79-70.84-499.83-70.84zm-18.094 48.627c63.04 0 114.13 10.573 114.13 23.613s-51.095 23.613-114.13 23.613c-63.027 0-114.13-10.573-114.13-23.613s51.106-23.613 114.13-23.613z" />
                                                <path
                                                    d="m963.6 445.05-0.73242 5.1738h13.08l-5.1074 36.32h5.7207l5.1055-36.32h11.68l0.72071-5.1738h-30.467zm41.215 0-13.693 41.494h5.4785l10.215-31.76h0.1328l7.1718 31.76 16.668-31.453h0.1191v31.453h5.4805v-41.494h-5.4805l-14.906 28.107-6.4395-28.107h-4.746z"
                                                    display="none" />
                                            </g>
                                        </svg>
                                    </button>
                                    <button type="button" class="btn-icon btn-format" data-format="bluray"
                                        title="Blu-Ray">
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                            viewBox="0 0 26.001 26.001" fill="#e3e3e3">
                                            <g>
                                                <g>
                                                    <path d="M2.737,8.325c-0.017,0-0.031,0.009-0.042,0.022c-1.151,1.621-1.845,2.718-2.565,4.05l-0.072,0.147
            l-0.021,0.047c-0.062,0.129-0.046,0.272,0.04,0.408c0.426,0.666,2.813,1.444,8.144,1.444c3.975,0,8.197-0.642,8.197-1.831
            c0-1.148-4.17-1.834-8.197-1.834c-1.338,0-2.662,0.188-3.044,0.248c0.364-0.561,1.877-2.598,1.893-2.619
            c0.007-0.009,0.012-0.019,0.012-0.03c0-0.008-0.003-0.016-0.006-0.024C7.064,8.337,7.047,8.325,7.029,8.325H2.737 M4.29,12.613
            c0-0.248,1.495-0.595,3.931-0.595c2.435,0,3.928,0.347,3.928,0.595s-1.493,0.594-3.928,0.594
            C5.785,13.207,4.29,12.861,4.29,12.613" />
                                                    <path d="M5.753,18.595c0,0,19.818,0.806,20.241-6.12c0.342-5.618-13.733-5.084-13.746-5.084
            S12.139,7.4,12.139,7.48c0,0.067,0.05,0.09,0.101,0.09c3.903,0,10.254,1.55,10.047,4.909c-0.167,2.736-5.122,5.938-16.527,5.938
            c-0.068,0-0.113,0.047-0.113,0.089S5.672,18.587,5.753,18.595" />
                                                </g>
                                            </g>
                                        </svg>
                                    </button>
                                    <button type="button" class="btn-icon btn-format" data-format="steelbook"
                                        title="Steelbook">
                                        <span class="btn-format-text">SB</span>
                                    </button>
                                    <button type="button" class="btn-icon btn-format" data-format="coffret"
                                        title="Coffret">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                            viewBox="0 0 24 24" fill="none" stroke="#e3e3e3" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-box-icon lucide-box">
                                            <path
                                                d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                                            <path d="m3.3 7 8.7 5 8.7-5" />
                                            <path d="M12 22V12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="edit-actions-row">
                            <button type="submit" class="btn-icon btn-edit-action" title="Valider les modifications"
                                id="btn-modal-inplace-save">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#e3e3e3">
                                    <path
                                        d="M382-267.69 183.23-466.46 211.77-495 382-324.77 748.23-691l28.54 28.54L382-267.69Z" />
                                </svg>
                            </button>
                            <button type="button" class="btn-icon btn-edit-action" title="Annuler"
                                id="btn-modal-inplace-cancel">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#e3e3e3">
                                    <path
                                        d="M296.15-240v-40h290.16q62.23 0 106.04-42.69 43.8-42.69 43.8-104.23 0-61.54-43.8-103.85-43.81-42.31-106.04-42.31H276.62l118.61 118.62-28.31 28.31L200-593.08 366.92-760l28.31 28.31-118.61 118.61h309.69q78.54 0 134.19 54.16 55.65 54.15 55.65 132 0 77.84-55.65 132.38Q664.85-240 586.31-240H296.15Z" />
                                </svg>
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            <div class="details-extra-info">
                <p><strong>Production :</strong> <span id="details-production">Studio</span></p>
                <p><strong>Musique :</strong> <span id="details-composer">Compositeur</span></p>
            </div>
        </div>
    </div>
</div>