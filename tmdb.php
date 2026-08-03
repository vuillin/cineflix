<?php

declare(strict_types=1);

require_once __DIR__ . '/src/Env.php';
require_once __DIR__ . '/src/TmdbService.php';

loadEnv(__DIR__ . '/.env');

/**
 * Compatibilité avec l’ancien API procédurale.
 *
 * @return array<string, mixed>|null
 */
function getMovieDetailsFromTMDB($tmdbId)
{
    $service = new TmdbService();
    return $service->getMovieDetails((int) $tmdbId);
}
