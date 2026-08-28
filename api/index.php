<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/bootstrap.php';
require_once dirname(__DIR__) . '/src/GenreNormalizer.php';
require_once dirname(__DIR__) . '/src/MovieRepository.php';
require_once dirname(__DIR__) . '/src/TmdbService.php';
require_once dirname(__DIR__) . '/src/TmdbFetchResult.php';
require_once dirname(__DIR__) . '/src/Logger.php';
require_once dirname(__DIR__) . '/src/Http/JsonResponse.php';
require_once dirname(__DIR__) . '/src/Http/Request.php';
require_once dirname(__DIR__) . '/src/Http/Input.php';
require_once __DIR__ . '/movies.php';
require_once __DIR__ . '/tmdb_preview.php';

if (isset($_GET['tmdb_preview'])) {
    $handle = tmdb_preview_handler($pdo);
    $handle();
    exit;
}

$handle = movies_handlers($pdo);
$handle();
