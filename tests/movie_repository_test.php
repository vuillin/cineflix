<?php

declare(strict_types=1);

/**
 * Tests CLI du MovieRepository (SQLite temporaire).
 * Usage : php tests/movie_repository_test.php
 */

require_once dirname(__DIR__) . '/src/GenreNormalizer.php';
require_once dirname(__DIR__) . '/src/MovieRepository.php';

function assert_true(bool $cond, string $message): void
{
    if (!$cond) {
        fwrite(STDERR, "FAIL: {$message}\n");
        exit(1);
    }
    echo "OK: {$message}\n";
}

$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$schema = file_get_contents(dirname(__DIR__) . '/schema.sql');
assert_true($schema !== false && $schema !== '', 'schema.sql lisible');
$pdo->exec($schema);

$repo = new MovieRepository($pdo);

assert_true(MovieRepository::generateSortTitle('Le Parrain') === 'Parrain', 'sort_title FR');
assert_true(MovieRepository::generateSortTitle('The Matrix') === 'Matrix', 'sort_title EN');

assert_true(
    GenreNormalizer::normalizeCsv('Aventure, Science Fiction, Fantastique') === 'Aventure, Science-Fiction, Fantaisie',
    'genres normalisés'
);

$id = $repo->create([
    'title' => 'Le Test Film',
    'director' => 'Jane Doe',
    'release_year' => 2024,
    'poster' => 'test.webp',
    'is_favorite' => 0,
    'bluray' => 1,
]);
assert_true($id > 0, 'create retourne un id');

$all = $repo->findAll();
assert_true(count($all) === 1, 'findAll après create');
assert_true($all[0]['sort_title'] === 'Test Film', 'sort_title persisté');

$found = $repo->findById($id);
assert_true($found !== null && $found['title'] === 'Le Test Film', 'findById');

$repo->updateFavorite($id, 1);
$found = $repo->findById($id);
assert_true((int) $found['is_favorite'] === 1, 'updateFavorite');

$repo->update(array_merge($found, [
    'title' => 'The Updated',
    'director' => 'John Doe',
]));
$found = $repo->findById($id);
assert_true($found['title'] === 'The Updated', 'update title');
assert_true($found['sort_title'] === 'Updated', 'update regenerates sort_title');

$repo->delete($id);
assert_true($repo->findById($id) === null, 'delete');
assert_true(count($repo->findAll()) === 0, 'findAll vide après delete');

echo "\nTous les tests repository sont passés.\n";
