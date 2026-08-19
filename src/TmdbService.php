<?php

declare(strict_types=1);

final class TmdbService
{
    private string $apiKey;
    private string $baseUrl = 'https://api.themoviedb.org/3/';

    public function __construct(?string $apiKey = null)
    {
        $this->apiKey = $apiKey ?? (getenv('TMDB_API_KEY') ?: '');
    }

    public function isConfigured(): bool
    {
        return $this->apiKey !== '';
    }

    public function getMoviePreview(int $tmdbId): ?array
    {
        if (!$this->isConfigured() || $tmdbId <= 0) {
            return null;
        }

        $url = $this->baseUrl . 'movie/' . $tmdbId
            . '?api_key=' . rawurlencode($this->apiKey)
            . '&language=fr-FR';
        $responseJson = @file_get_contents($url);

        if ($responseJson === false) {
            return null;
        }

        $tmdbData = json_decode($responseJson, true);
        if (!$tmdbData || isset($tmdbData['status_code']) || empty($tmdbData['title'])) {
            return null;
        }

        $releaseYear = null;
        if (!empty($tmdbData['release_date'])) {
            $releaseYear = (int) substr($tmdbData['release_date'], 0, 4);
        }
        
        return [
            'tmdb_id' => $tmdbId,
            'title' => (string) $tmdbData['title'],
            'release_year' => $releaseYear,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getMovieDetails(int $tmdbId): ?array
    {
        if (!$this->isConfigured() || $tmdbId <= 0) {
            return null;
        }

        $url = $this->baseUrl . 'movie/' . $tmdbId
            . '?api_key=' . rawurlencode($this->apiKey)
            . '&language=fr-FR&append_to_response=credits,keywords,release_dates';

        $responseJson = @file_get_contents($url);
        if ($responseJson === false) {
            return null;
        }

        $tmdbData = json_decode($responseJson, true);
        if (!$tmdbData || isset($tmdbData['status_code'])) {
            return null;
        }

        $castMembers = [];
        if (!empty($tmdbData['credits']['cast'])) {
            foreach (array_slice($tmdbData['credits']['cast'], 0, 5) as $actor) {
                $castMembers[] = $actor['name'];
            }
        }

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

        $genres = [];
        if (!empty($tmdbData['genres']) && is_array($tmdbData['genres'])) {
            foreach ($tmdbData['genres'] as $genre) {
                $genres[] = $genre['name'];
            }
        }

        $productionCompanies = [];
        if (!empty($tmdbData['production_companies'])) {
            foreach ($tmdbData['production_companies'] as $company) {
                $productionCompanies[] = $company['name'];
            }
        }

        $keywords = [];
        if (!empty($tmdbData['keywords']['keywords'])) {
            foreach ($tmdbData['keywords']['keywords'] as $kw) {
                $keywords[] = $kw['name'];
            }
        }

        $collectionName = null;
        if (!empty($tmdbData['belongs_to_collection'])) {
            $collectionName = $tmdbData['belongs_to_collection']['name'];
        }

        $certification = $this->extractCertification($tmdbData);

        $releaseYear = null;
        if (!empty($tmdbData['release_date'])) {
            $releaseYear = (int) substr($tmdbData['release_date'], 0, 4);
        }

        return [
            'title' => $tmdbData['title'] ?? null,
            'director' => $director,
            'release_year' => $releaseYear,
            'genres' => implode(', ', $genres),
            'tmdb_id' => $tmdbId,
            'backdrop' => $tmdbData['backdrop_path'] ?? null,
            'original_title' => $tmdbData['original_title'] ?? null,
            'original_language' => $tmdbData['original_language'] ?? null,
            'overview' => $tmdbData['overview'] ?? null,
            'tagline' => $tmdbData['tagline'] ?? null,
            'status' => $tmdbData['status'] ?? null,
            'runtime' => isset($tmdbData['runtime']) ? (int) $tmdbData['runtime'] : null,
            'adult' => !empty($tmdbData['adult']) ? 1 : 0,
            'popularity' => isset($tmdbData['popularity']) ? (float) $tmdbData['popularity'] : 0.0,
            'vote_average' => isset($tmdbData['vote_average']) ? (float) $tmdbData['vote_average'] : 0.0,
            'vote_count' => isset($tmdbData['vote_count']) ? (int) $tmdbData['vote_count'] : 0,
            'budget' => isset($tmdbData['budget']) ? (int) $tmdbData['budget'] : 0,
            'revenue' => isset($tmdbData['revenue']) ? (int) $tmdbData['revenue'] : 0,
            'production_companies' => implode(', ', $productionCompanies),
            'cast_members' => implode(', ', $castMembers),
            'screenplay' => implode(', ', array_unique($screenplays)),
            'producer' => implode(', ', array_unique($producers)),
            'composer' => implode(', ', array_unique($composers)),
            'keywords' => implode(', ', $keywords),
            'collection_name' => $collectionName,
            'certification' => $certification,
        ];
    }

    /**
     * Merge TMDB data under client-provided fields (client wins when non-empty).
     *
     * @param array<string, mixed> $input
     * @param array<string, mixed> $tmdb
     * @return array<string, mixed>
     */
    public static function mergeMovieData(array $input, array $tmdb): array
    {
        $merged = $tmdb;
        foreach ($input as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }
            $merged[$key] = $value;
        }
        return $merged;
    }

    /**
     * @param array<string, mixed> $tmdbData
     */
    private function extractCertification(array $tmdbData): ?string
    {
        if (empty($tmdbData['release_dates']['results'])) {
            return null;
        }

        foreach (['FR', 'US'] as $country) {
            foreach ($tmdbData['release_dates']['results'] as $countryRelease) {
                if (($countryRelease['iso_3166_1'] ?? '') !== $country) {
                    continue;
                }
                foreach ($countryRelease['release_dates'] as $rd) {
                    if (!empty($rd['certification'])) {
                        return $rd['certification'];
                    }
                }
            }
        }

        return null;
    }
}
