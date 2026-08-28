<?php

declare(strict_types=1);

final class GenreNormalizer
{
    /** @var array<string, string> Variantes TMDB → noms canoniques (modale genres) */
    private const ALIASES = [
        'Science Fiction' => 'Science-Fiction',
        'Fantastique' => 'Fantaisie',
        'Fantasy' => 'Fantaisie',
    ];

    public static function normalize(string $genre): string
    {
        $genre = trim($genre);
        if ($genre === '') {
            return $genre;
        }

        return self::ALIASES[$genre] ?? $genre;
    }

    /**
     * @param list<string> $genres
     * @return list<string>
     */
    public static function normalizeList(array $genres): array
    {
        return array_map(self::normalize(...), $genres);
    }

    public static function normalizeCsv(?string $genres): ?string
    {
        if ($genres === null || trim($genres) === '') {
            return $genres;
        }

        $parts = array_map('trim', explode(',', $genres));

        return implode(', ', self::normalizeList($parts));
    }
}
