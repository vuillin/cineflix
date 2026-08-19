<div id="add-film-modal" class="netflix-modal hidden-modal" role="dialog" aria-modal="true" aria-labelledby="add-film-title">
    <div class="add-film-panel">
        <button type="button" id="close-add-film-modal" class="close-btn" aria-label="Fermer">&times;</button>
        <h2 id="add-film-title">Ajouter un film</h2>
        <p class="add-film-preview" id="add-film-preview">Film : <span class="add-film-preview__value">-</span></p>
        <form id="form-ajout-film" autocomplete="off">
            <div class="edit-row">
                <div class="form-group-inplace form-group-small">
                    <label for="tmdb_id">ID TMDB</label>
                    <input type="number" id="tmdb_id" name="tmdb_id" required min="1" placeholder="Ex: 550">
                </div>

                <div class="form-group-inplace form-group-large">
                    <label for="poster">AFFICHE</label>
                    <input type="text" id="poster" name="poster" placeholder="Ex: fight_club">
                </div>
            </div>

            <div class="add-film-divider" aria-hidden="true"></div>

            <div class="add-film-formats">
                <div class="formats-buttons-row">
                    <button type="button" class="btn-icon btn-format" data-format="dvd" title="DVD">
                        <svg width="24px" height="24px" viewBox="0 0 1058.4 465.84" fill="#e3e3e3"
                            xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path
                                    d="m91.053 0-13.719 57.707 102.28 0.039063h24c65.747 0 105.91 26.44 94.746 73.4-12.147 51.133-69.613 73.4-130.67 73.4h-22.947l29.787-125.45h-102.27l-43.521 183.2h145.05c109.07 0 212.76-57.573 231.01-131.15 3.3467-13.507 2.8806-47.253-5.3594-67.359-0.21299-0.787-0.42594-1.4-1.1855-3-0.293-0.653-0.56012-3.6412 1.1465-4.2812 0.947-0.36 2.7069 1.4944 2.9336 2.041 0.853 2.24 1.5059 3.9062 1.5059 3.9062l92.293 260.6 234.97-265.21 99.535-0.089844h24c65.76 0 106.25 26.44 95.092 73.4-12.147 51.133-69.947 73.4-131 73.4h-22.959l29.799-125.47h-102.27l-43.533 183.21h145.07c109.05 0 213.48-57.4 231-131.15 17.52-73.75-59.107-131.15-168.69-131.15h-216.4s-57.319 67.88-67.959 80.693c-57.12 68.787-67.241 87.226-68.961 91.986 0.24-4.8-1.8138-23.412-26.174-92.959-6.48-18.52-27.359-79.721-27.359-79.721h-389.25zm408.77 324.16c-276.04 0-499.83 31.72-499.83 70.84s223.79 70.84 499.83 70.84c276.04 0 499.83-31.72 499.83-70.84s-223.79-70.84-499.83-70.84zm-18.094 48.627c63.04 0 114.13 10.573 114.13 23.613s-51.095 23.613-114.13 23.613c-63.027 0-114.13-10.573-114.13-23.613s51.106-23.613 114.13-23.613z" />
                            </g>
                        </svg>
                    </button>
                    <button type="button" class="btn-icon btn-format" data-format="bluray" title="Blu-Ray">
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
                    <button type="button" class="btn-icon btn-format" data-format="steelbook" title="Steelbook">
                        <span class="btn-format-text">SB</span>
                    </button>
                    <button type="button" class="btn-icon btn-format" data-format="coffret" title="Coffret">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
                            fill="none" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" class="lucide lucide-box-icon lucide-box">
                            <path
                                d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                            <path d="m3.3 7 8.7 5 8.7-5" />
                            <path d="M12 22V12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="edit-actions-row">
                <button type="submit" id="btn-submit-add-film" class="btn-icon btn-edit-action" title="Valider" aria-label="Valider">
                    <span class="btn-edit-action__icon" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                            <path d="M382-267.69 183.23-466.46 211.77-495 382-324.77 748.23-691l28.54 28.54L382-267.69Z" />
                        </svg>
                    </span>
                    <span class="btn-edit-action__spinner" aria-hidden="true"></span>
                </button>
            </div>
        </form>
    </div>
</div>
