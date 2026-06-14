<?php

require_once __DIR__ . '/env.php';

define('TMDB_API_KEY', getenv('TMDB_API_KEY') ?: '');
define('TMDB_BASE_URL', 'https://api.themoviedb.org/3/');

if (TMDB_API_KEY === '') {
    throw new RuntimeException('TMDB_API_KEY manquante. Copie .env.example vers .env et ajoute ta clé API.');
}

function getMovieDetailsFromTMDB($tmdbId)
{
    $url = TMDB_BASE_URL . "movie/" . $tmdbId . "?api_key=" . TMDB_API_KEY . "&language=fr-FR&append_to_response=credits,keywords,release_dates";

    $responseJSON = @file_get_contents($url);

    if ($responseJSON === false) {
        return null;
    }

    $tmdbData = json_decode($responseJSON, true);

    if (!$tmdbData || isset($tmdbData['status_code'])) {
        return null;
    }

    $title = $tmdbData['title'] ?? null;
    $original_title = $tmdbData['original_title'] ?? null;
    $original_language = $tmdbData['original_language'] ?? null;
    $overview = $tmdbData['overview'] ?? null;
    $tagline = $tmdbData['tagline'] ?? null;
    $status = $tmdbData['status'] ?? null;
    $runtime = isset($tmdbData['runtime']) ? (int) $tmdbData['runtime'] : null;
    $adult = isset($tmdbData['adult']) && $tmdbData['adult'] ? 1 : 0;
    $popularity = isset($tmdbData['popularity']) ? (float) $tmdbData['popularity'] : 0.0;
    $vote_average = isset($tmdbData['vote_average']) ? (float) $tmdbData['vote_average'] : 0.0;
    $vote_count = isset($tmdbData['vote_count']) ? (int) $tmdbData['vote_count'] : 0;
    $budget = isset($tmdbData['budget']) ? (int) $tmdbData['budget'] : 0;
    $revenue = isset($tmdbData['revenue']) ? (int) $tmdbData['revenue'] : 0;

    $release_year = null;
    if (!empty($tmdbData['release_date'])) {
        $release_year = (int) substr($tmdbData['release_date'], 0, 4);
    }

    $cast_members = [];
    if (!empty($tmdbData['credits']['cast'])) {
        $cast_limit = array_slice($tmdbData['credits']['cast'], 0, 5);
        foreach ($cast_limit as $actor) {
            $cast_members[] = $actor['name'];
        }
    }
    $cast_members_str = implode(', ', $cast_members);

    $director = null;
    $screenplays = [];
    $producers = [];
    $composers = [];

    if (isset($tmdbData['credits']['crew'])) {
        foreach ($tmdbData['credits']['crew'] as $person) {
            if ($person['job'] === 'Director' && !$director) {
                $director = $person['name'];
            }
            if ($person['job'] === 'Screenplay' || $person['job'] === 'Writer') {
                $screenplays[] = $person['name'];
            }
            if ($person['job'] === 'Producer') {
                $producers[] = $person['name'];
            }
            if ($person['job'] === 'Original Music Composer' || $person['job'] === 'Music') {
                $composers[] = $person['name'];
            }
        }
    }
    $screenplay_str = implode(', ', array_unique($screenplays));
    $producer_str = implode(', ', array_unique($producers));
    $composer_str = implode(', ', array_unique($composers));

    $genres = [];
    if (isset($tmdbData['genres']) && is_array($tmdbData['genres'])) {
        foreach ($tmdbData['genres'] as $genre) {
            $genres[] = $genre['name'];
        }
    }
    $genres_str = implode(', ', $genres);

    $production_companies = [];
    if (!empty($tmdbData['production_companies'])) {
        foreach ($tmdbData['production_companies'] as $company) {
            $production_companies[] = $company['name'];
        }
    }
    $production_companies_str = implode(', ', $production_companies);

    $keywords = [];
    if (!empty($tmdbData['keywords']['keywords'])) {
        foreach ($tmdbData['keywords']['keywords'] as $kw) {
            $keywords[] = $kw['name'];
        }
    }
    $keywords_str = implode(', ', $keywords);

    $collection_name = null;
    if (!empty($tmdbData['belongs_to_collection'])) {
        $collection_name = $tmdbData['belongs_to_collection']['name'];
    }

    // FR en priorité, US en secours
    $certification = null;
    if (!empty($tmdbData['release_dates']['results'])) {
        foreach ($tmdbData['release_dates']['results'] as $country_release) {
            if ($country_release['iso_3166_1'] === 'FR') {
                foreach ($country_release['release_dates'] as $rd) {
                    if (!empty($rd['certification'])) {
                        $certification = $rd['certification'];
                        break 2;
                    }
                }
            }
        }
        if (!$certification) {
            foreach ($tmdbData['release_dates']['results'] as $country_release) {
                if ($country_release['iso_3166_1'] === 'US') {
                    foreach ($country_release['release_dates'] as $rd) {
                        if (!empty($rd['certification'])) {
                            $certification = $rd['certification'];
                            break 2;
                        }
                    }
                }
            }
        }
    }

    return [
        'title' => $title,
        'director' => $director,
        'release_year' => $release_year,
        'genres' => $genres_str,
        'tmdb_id' => $tmdbId,
        'backdrop' => $tmdbData['backdrop_path'] ?? null,
        'original_title' => $original_title,
        'original_language' => $original_language,
        'overview' => $overview,
        'tagline' => $tagline,
        'status' => $status,
        'runtime' => $runtime,
        'adult' => $adult,
        'popularity' => $popularity,
        'vote_average' => $vote_average,
        'vote_count' => $vote_count,
        'budget' => $budget,
        'revenue' => $revenue,
        'production_companies' => $production_companies_str,
        'cast_members' => $cast_members_str,
        'screenplay' => $screenplay_str,
        'producer' => $producer_str,
        'composer' => $composer_str,
        'keywords' => $keywords_str,
        'collection_name' => $collection_name,
        'certification' => $certification
    ];
}

?>
