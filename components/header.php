<header class="netflix-header" id="netflix-header">
    <div class="header-left">
        <img src="assets/images/assets/logo_cineflix.png" alt="Cineflix" class="site-logo">
        <nav class="main-nav">
            <ul>
                <li><a href="#" class="nav-btn active" data-target="view-accueil">Accueil</a></li>
                <li><a href="#" class="nav-btn" data-target="view-collection">Collection</a></li>
                <li><a href="#" class="nav-btn" data-target="view-favoris">Mes favoris</a></li>
            </ul>
        </nav>
    </div>
    <div class="header-right">
        <div id="collection-header-actions" class="header-collection-actions hidden">
            <div id="header-search" class="header-search">
                <button type="button" id="btn-search" class="btn-search" aria-label="Rechercher un film" aria-expanded="false" aria-controls="header-search-input">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor" aria-hidden="true">
                        <path d="M784-120 532-372q-30 24-69 38t-77 14q-109 0-184.5-75.5T126-580q0-109 75.5-184.5T386-840q109 0 184.5 75.5T646-580q0 38-14 77t-38 69l252 252-62 62ZM386-400q75 0 127.5-52.5T566-580q0-75-52.5-127.5T386-760q-75 0-127.5 52.5T206-580q0 75 52.5 127.5T386-400Z"/>
                    </svg>
                </button>
                <input type="search" id="header-search-input" class="header-search-input" placeholder="Titre" autocomplete="off" spellcheck="off" tabindex="-1">
            </div>
            <button id="btn-ajouter-film" class="btn-add-film" aria-label="Ajouter un film">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                </svg>
                Ajouter un film
            </button>
        </div>
    </div>
</header>
