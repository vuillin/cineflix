<?php

declare(strict_types=1);

final class MovieRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM movies ORDER BY sort_title COLLATE NOCASE ASC');
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM movies WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public static function generateSortTitle(string $title): string
    {
        $pattern = '/^(Le |La |Les |L\'|Un |Une |Des |The |A |An )/i';
        return trim(preg_replace($pattern, '', $title) ?? $title);
    }

    public function create(array $data): int
    {
        $sql = 'INSERT INTO movies (
            title, sort_title, director, release_year, poster, tmdb_id, genres, backdrop,
            certification, is_favorite, dvd, bluray, steelbook, coffret,
            original_title, original_language, overview, tagline, status, runtime, adult,
            popularity, vote_average, vote_count, budget, revenue, production_companies,
            cast_members, screenplay, producer, composer, keywords, collection_name
        ) VALUES (
            :title, :sort_title, :director, :release_year, :poster, :tmdb_id, :genres, :backdrop,
            :certification, :is_favorite, :dvd, :bluray, :steelbook, :coffret,
            :original_title, :original_language, :overview, :tagline, :status, :runtime, :adult,
            :popularity, :vote_average, :vote_count, :budget, :revenue, :production_companies,
            :cast_members, :screenplay, :producer, :composer, :keywords, :collection_name
        )';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->bindPayload($data, includeId: false));
        return (int) $this->pdo->lastInsertId();
    }

    public function update(array $data): void
    {
        $sql = 'UPDATE movies SET
            title = :title,
            sort_title = :sort_title,
            director = :director,
            release_year = :release_year,
            poster = :poster,
            tmdb_id = :tmdb_id,
            genres = :genres,
            backdrop = :backdrop,
            certification = :certification,
            is_favorite = :is_favorite,
            dvd = :dvd,
            bluray = :bluray,
            steelbook = :steelbook,
            coffret = :coffret,
            original_title = :original_title,
            original_language = :original_language,
            overview = :overview,
            tagline = :tagline,
            status = :status,
            runtime = :runtime,
            adult = :adult,
            popularity = :popularity,
            vote_average = :vote_average,
            vote_count = :vote_count,
            budget = :budget,
            revenue = :revenue,
            production_companies = :production_companies,
            cast_members = :cast_members,
            screenplay = :screenplay,
            producer = :producer,
            composer = :composer,
            keywords = :keywords,
            collection_name = :collection_name
        WHERE id = :id';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->bindPayload($data, includeId: true));
    }

    public function updateFavorite(int $id, int $isFavorite): void
    {
        $stmt = $this->pdo->prepare('UPDATE movies SET is_favorite = :is_favorite WHERE id = :id');
        $stmt->execute([
            ':id' => $id,
            ':is_favorite' => $isFavorite ? 1 : 0,
        ]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM movies WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }

    private function bindPayload(array $data, bool $includeId): array
    {
        $title = (string) ($data['title'] ?? '');
        $params = [
            ':title' => $title,
            ':sort_title' => self::generateSortTitle($title),
            ':director' => $data['director'] ?? null,
            ':release_year' => $data['release_year'] ?? null,
            ':poster' => $data['poster'] ?? null,
            ':tmdb_id' => $data['tmdb_id'] ?? null,
            ':genres' => $data['genres'] ?? null,
            ':backdrop' => $data['backdrop'] ?? null,
            ':certification' => $data['certification'] ?? null,
            ':is_favorite' => (int) ($data['is_favorite'] ?? 0),
            ':dvd' => (int) ($data['dvd'] ?? 0),
            ':bluray' => (int) ($data['bluray'] ?? 0),
            ':steelbook' => (int) ($data['steelbook'] ?? 0),
            ':coffret' => (int) ($data['coffret'] ?? 0),
            ':original_title' => $data['original_title'] ?? null,
            ':original_language' => $data['original_language'] ?? null,
            ':overview' => $data['overview'] ?? null,
            ':tagline' => $data['tagline'] ?? null,
            ':status' => $data['status'] ?? null,
            ':runtime' => $data['runtime'] ?? null,
            ':adult' => isset($data['adult']) ? (int) $data['adult'] : null,
            ':popularity' => $data['popularity'] ?? null,
            ':vote_average' => $data['vote_average'] ?? null,
            ':vote_count' => $data['vote_count'] ?? null,
            ':budget' => $data['budget'] ?? null,
            ':revenue' => $data['revenue'] ?? null,
            ':production_companies' => $data['production_companies'] ?? null,
            ':cast_members' => $data['cast_members'] ?? null,
            ':screenplay' => $data['screenplay'] ?? null,
            ':producer' => $data['producer'] ?? null,
            ':composer' => $data['composer'] ?? null,
            ':keywords' => $data['keywords'] ?? null,
            ':collection_name' => $data['collection_name'] ?? null,
        ];

        if ($includeId) {
            $params[':id'] = (int) $data['id'];
        }

        return $params;
    }

    public function findByTmdbId(int $tmdbId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM movies WHERE tmdb_id = :tmdb_id LIMIT 1');
        $stmt->execute([':tmdb_id' => $tmdbId]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function findByPoster(string $poster): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM movies WHERE poster = :poster LIMIT 1');
        $stmt->execute([':poster' => $poster]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function findByTmdbIdForOther(int $tmdbId, int $excludeId): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM movies WHERE tmdb_id = :tmdb_id AND id != :exclude_id LIMIT 1'
        );
        $stmt->execute([
            ':tmdb_id' => $tmdbId,
            ':exclude_id' => $excludeId
        ]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function findByPosterForOther(string $poster, int $excludeId): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM movies WHERE poster = :poster AND id != :exclude_id LIMIT 1'
        );
        $stmt->execute([
            ':poster' => $poster,
            ':exclude_id' => $excludeId,
        ]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public static function normalizePosterFilename(?string $poster): ?string
    {
        if ($poster === null || trim($poster) === '') {
            return null;
        }
        $value = trim($poster);
        if (!str_ends_with(strtolower($value), '.webp')) {
            $value = preg_replace('/\.(png|jpe?g)$/i', '', $value) ?? $value;
            $value .= '.webp';
        }
        return $value;
    }
}
