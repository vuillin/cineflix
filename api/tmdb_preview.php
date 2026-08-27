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

        $preview = $tmdb->getMoviePreview($tmdbId);
        if (!$preview->isOk()) {
            $preview->respondAsJsonError();
        }

        $payload = $preview->data;
        
        $payload['already_exists'] = $repo->findByTmdbId($tmdbId) !== null;
        JsonResponse::send($payload);
    };
}