<?php

declare(strict_types=1);

/**
 * Tests CLI du MovieRepository (SQLite temporaire).
 */

require_once __DIR__ . '/support.php';
require_once dirname(__DIR__) . '/src/GenreNormalizer.php';
require_once dirname(__DIR__) . '/src/MovieRepository.php';

$pdo = createTestPdo();
$repo = new MovieRepository($pdo);

assert_true(MovieRepository::generateSortTitle('Le Parrain') === 'Parrain', 'sort_title FR');
assert_true(MovieRepository::generateSortTitle('The Matrix') === 'Matrix', 'sort_title EN');

assert_true(
    GenreNormalizer::normalizeCsv('Aventure, Science Fiction, Fantastique') === 'Aventure, Science-Fiction, Fantaisie',
    'genres normalisés'
);

assert_true(MovieRepository::normalizePosterFilename('fight_club') === 'fight_club.webp', 'poster ajoute .webp');
assert_true(MovieRepository::normalizePosterFilename('poster.jpg') === 'poster.webp', 'poster convertit jpg');
assert_true(MovieRepository::normalizePosterFilename(null) === null, 'poster null reste null');

$id = $repo->create([
    'title' => 'Le Test Film',
    'director' => 'Jane Doe',
    'release_year' => 2024,
    'poster' => 'test.webp',
    'tmdb_id' => 550,
    'is_favorite' => 0,
    'bluray' => 1,
]);
assert_true($id > 0, 'create retourne un id');

$byTmdb = $repo->findByTmdbId(550);
assert_true($byTmdb !== null && (int) $byTmdb['id'] === $id, 'findByTmdbId');

$byPoster = $repo->findByPoster('test.webp');
assert_true($byPoster !== null && (int) $byPoster['id'] === $id, 'findByPoster');

$id2 = $repo->create([
    'title' => 'Autre Film',
    'poster' => 'other.webp',
    'tmdb_id' => 551,
    'bluray' => 0,
]);
assert_true($id2 > 0, 'second film créé');

$otherTmdb = $repo->findByTmdbIdForOther(550, $id2);
assert_true($otherTmdb !== null && (int) $otherTmdb['id'] === $id, 'findByTmdbIdForOther trouve le doublon');

$otherPoster = $repo->findByPosterForOther('test.webp', $id2);
assert_true($otherPoster !== null && (int) $otherPoster['id'] === $id, 'findByPosterForOther trouve le doublon');

$uniqueTmdbFailed = false;
try {
    $repo->create([
        'title' => 'Doublon TMDB',
        'poster' => 'dup_tmdb.webp',
        'tmdb_id' => 550,
    ]);
} catch (PDOException) {
    $uniqueTmdbFailed = true;
}
assert_true($uniqueTmdbFailed, 'contrainte unique tmdb_id en base');

$uniquePosterFailed = false;
try {
    $repo->create([
        'title' => 'Doublon poster',
        'poster' => 'test.webp',
        'tmdb_id' => 552,
    ]);
} catch (PDOException) {
    $uniquePosterFailed = true;
}
assert_true($uniquePosterFailed, 'contrainte unique poster en base');

$all = $repo->findAll();
assert_true(count($all) === 2, 'findAll après creates');
assert_true($all[0]['sort_title'] === 'Autre Film' || $all[1]['sort_title'] === 'Test Film', 'sort_title persisté');

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
assert_true(count($repo->findAll()) === 1, 'findAll après delete');

if (test_failures() === 0) {
    echo "\nTous les tests repository sont passés.\n";
}

exit(test_failures() > 0 ? 1 : 0);
