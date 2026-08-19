<?php

declare(strict_types=1);

/**
 * @return callable
 */
function tmdb_preview_handler(PDO $pdo): callable
{
    $repo = new MovieRepository($pdo);
    $tmdb = new TmdbService();

    return static function () use ($repo, $tmdb): void {
        if (Request::method() !== 'GET') {
            JsonResponse::error('Méthode non autorisée', 405);
        }

        $tmdbId = isset($_GET['tmdb_preview']) ? (int) $_GET['tmdb_preview'] : 0;
        if ($tmdbId <= 0) {
            JsonResponse::error('ID TMDB invalide');
        }

        if (!$tmdb->isConfigured()) {
            JsonResponse::error('Clé TMDB non configurée', 503);
        }

        $preview = $tmdb->getMoviePreview($tmdbId);
        if ($preview === null) {
            JsonResponse::error('Film introuvable sur TMDB', 404);
        }

        $preview['already_exists'] = $repo->findByTmdbId($tmdbId) !== null;

        JsonResponse::send($preview);
    };
}