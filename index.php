<?php

declare(strict_types=1);

require_once __DIR__ . '/src/Env.php';
loadEnv(__DIR__ . '/.env');

$apiToken = getenv('CINEFLIX_API_TOKEN') ?: '';
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cineflix</title>
    <link rel="icon" href="assets/images/assets/logo-c.ico" type="image/x-icon">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .hidden {
            display: none !important;
        }
    </style>
</head>

<body>

    <?php include 'components/header.php'; ?>

    <div class="app-container">
        <div id="subheader-collection" class="page-subheader hidden">
            <div class="subheader-left">
                <h1 class="page-title">Films</h1>
                <div class="collection-toolbar">
                    <div class="genre-filter-container" id="genre-filter-container">
                        <button id="genre-btn" class="netflix-select-btn" aria-label="Filtrer par genre">
                            Genres
                        </button>
                    </div>
                    <div class="sort-menu-container" id="sort-menu-container">
                        <button
                            type="button"
                            id="sort-btn"
                            class="netflix-select-btn"
                            aria-label="Trier la collection"
                            aria-expanded="false"
                            aria-haspopup="listbox"
                            aria-controls="sort-menu"
                        >
                            <span id="sort-btn-label" class="sort-btn__label">
                                Trier - <span class="sort-btn__current">Titre (A–Z)</span>
                            </span>
                            <svg class="sort-btn__chevron" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor" aria-hidden="true">
                                <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
                            </svg>
                        </button>
                        <ul id="sort-menu" class="sort-menu hidden" role="listbox" aria-labelledby="sort-btn">
                            <li class="sort-menu__item is-selected" role="option" aria-selected="true" data-sort="title">Titre (A–Z)</li>
                            <li class="sort-menu__item" role="option" aria-selected="false" data-sort="year">Année</li>
                            <li class="sort-menu__item" role="option" aria-selected="false" data-sort="rating">Note TMDB</li>
                            <li class="sort-menu__item" role="option" aria-selected="false" data-sort="format">Formats</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div id="subheader-favoris" class="page-subheader hidden">
            <h1 class="page-title">Mes Favoris</h1>
        </div>

        <?php include 'components/modale_details.php'; ?>
        <?php include 'components/modale_genres.php'; ?>
        <?php include 'components/modale_ajout.php'; ?>

        <main class="main-content">
            <?php include 'views/accueil.php'; ?>
            <?php include 'views/collection.php'; ?>
            <?php include 'views/favoris.php'; ?>
        </main>
    </div>

    <script>
        window.__CINEFLIX__ = {
            apiToken: <?= json_encode($apiToken, JSON_UNESCAPED_UNICODE) ?>
        };
    </script>
    <script type="module" src="assets/js/main.js"></script>
</body>

</html>
