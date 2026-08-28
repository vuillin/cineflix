<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/TmdbFetchResult.php';

final class FakeTmdbService
{
    public function getMovieDetails(int $tmdbId): TmdbFetchResult
    {
        return TmdbFetchResult::ok([
            'title' => 'Film test API ' . $tmdbId,
            'director' => 'Réalisateur test',
            'release_year' => 2024,
            'genres' => 'Drame',
            'tmdb_id' => $tmdbId,
            'backdrop' => null,
            'original_title' => null,
            'original_language' => 'fr',
            'overview' => 'Synopsis test',
            'tagline' => null,
            'status' => 'Released',
            'runtime' => 120,
            'adult' => 0,
            'popularity' => 1.0,
            'vote_average' => 7.5,
            'vote_count' => 100,
            'budget' => 0,
            'revenue' => 0,
            'production_companies' => '',
            'cast_members' => 'Acteur Test',
            'screenplay' => '',
            'producer' => '',
            'composer' => '',
            'keywords' => '',
            'collection_name' => null,
            'certification' => null,
        ]);
    }
}
