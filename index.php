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
                <div class="genre-filter-container" id="genre-filter-container">
                    <button id="genre-btn" class="netflix-select-btn" aria-label="Filtrer par genre">
                        Genres
                    </button>
                </div>
            </div>
        </div>

        <div id="subheader-favoris" class="page-subheader hidden">
            <h1 class="page-title">Mes Favoris</h1>
        </div>

        <?php include 'components/modale_details.php'; ?>
        <?php include 'components/modale_genres.php'; ?>

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
