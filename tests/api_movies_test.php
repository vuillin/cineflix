<?php

declare(strict_types=1);

/**
 * Tests CLI de l'API movies (handler direct, sans serveur HTTP).
 */

require_once __DIR__ . '/support.php';
require_once __DIR__ . '/api_support.php';

$pdo = createTestPdo();
$fakeTmdb = new FakeTmdbService();

// GET
$getEmpty = invokeMoviesHandler($pdo, 'GET', null, null);
assert_status($getEmpty, 200, 'GET liste vide');
assert_true(is_array($getEmpty['body']) && count($getEmpty['body']) === 0, 'GET retourne un tableau vide');

seedMovie($pdo, ['title' => 'Inception', 'poster' => 'inception.webp', 'tmdb_id' => 27205]);
$getList = invokeMoviesHandler($pdo, 'GET', null, null);
assert_status($getList, 200, 'GET liste avec films');
assert_true(is_array($getList['body']) && count($getList['body']) === 1, 'GET retourne un film');

// POST — auth
$postNoToken = invokeMoviesHandler($pdo, 'POST', ['tmdb_id' => 123], null, $fakeTmdb);
assert_error($postNoToken, 401, 'POST sans token');

$postBadToken = invokeMoviesHandler($pdo, 'POST', ['tmdb_id' => 123], 'wrong-token', $fakeTmdb);
assert_error($postBadToken, 401, 'POST token invalide');

// POST — OK
$postOk = invokeMoviesHandler($pdo, 'POST', [
    'tmdb_id' => 550,
    'poster' => 'fight_club',
    'bluray' => 1,
], 'test-token', $fakeTmdb);
assert_status($postOk, 200, 'POST création OK');
assert_true(
    is_array($postOk['body']) && ($postOk['body']['success'] ?? '') === 'Film ajouté',
    'POST retourne success'
);

$postDupTmdb = invokeMoviesHandler($pdo, 'POST', [
    'tmdb_id' => 550,
    'poster' => 'other.webp',
], 'test-token', $fakeTmdb);
assert_error($postDupTmdb, 409, 'POST doublon tmdb_id');

$postDupPoster = invokeMoviesHandler($pdo, 'POST', [
    'tmdb_id' => 551,
    'poster' => 'fight_club.webp',
], 'test-token', $fakeTmdb);
assert_error($postDupPoster, 409, 'POST doublon poster');

// PATCH — auth + 404 + OK
$patchId = seedMovie($pdo, ['title' => 'Patch Me', 'poster' => 'patch.webp', 'tmdb_id' => 601]);

$patchNoToken = invokeMoviesHandler($pdo, 'PATCH', ['id' => $patchId, 'is_favorite' => 1], null);
assert_error($patchNoToken, 401, 'PATCH sans token');

$patch404 = invokeMoviesHandler($pdo, 'PATCH', ['id' => 99999, 'is_favorite' => 1]);
assert_error($patch404, 404, 'PATCH film introuvable');

$patchOk = invokeMoviesHandler($pdo, 'PATCH', ['id' => $patchId, 'is_favorite' => 1]);
assert_status($patchOk, 200, 'PATCH favori OK');
assert_true(
    is_array($patchOk['body']) && ($patchOk['body']['success'] ?? '') === 'Favori mis à jour',
    'PATCH retourne success'
);

// PUT — auth + 404 + 409 + OK
$putId1 = seedMovie($pdo, ['title' => 'Film A', 'poster' => 'a.webp', 'tmdb_id' => 701]);
$putId2 = seedMovie($pdo, ['title' => 'Film B', 'poster' => 'b.webp', 'tmdb_id' => 702]);

$putNoToken = invokeMoviesHandler($pdo, 'PUT', ['id' => $putId1, 'title' => 'X'], null);
assert_error($putNoToken, 401, 'PUT sans token');

$put404 = invokeMoviesHandler($pdo, 'PUT', ['id' => 99999, 'title' => 'X']);
assert_error($put404, 404, 'PUT film introuvable');

$putDupTmdb = invokeMoviesHandler($pdo, 'PUT', [
    'id' => $putId2,
    'title' => 'Film B',
    'tmdb_id' => 701,
]);
assert_error($putDupTmdb, 409, 'PUT doublon tmdb_id');

$putDupPoster = invokeMoviesHandler($pdo, 'PUT', [
    'id' => $putId2,
    'title' => 'Film B',
    'poster' => 'a.webp',
]);
assert_error($putDupPoster, 409, 'PUT doublon poster');

$putOk = invokeMoviesHandler($pdo, 'PUT', [
    'id' => $putId1,
    'title' => 'Film A modifié',
    'poster' => 'a.webp',
    'tmdb_id' => 701,
    'bluray' => 1,
]);
assert_status($putOk, 200, 'PUT modification OK');
assert_true(
    is_array($putOk['body']) && ($putOk['body']['success'] ?? '') === 'Film modifié',
    'PUT retourne success'
);

// DELETE — auth + 404 + OK
$deleteId = seedMovie($pdo, ['title' => 'À supprimer', 'poster' => 'del.webp', 'tmdb_id' => 801]);

$deleteNoToken = invokeMoviesHandler($pdo, 'DELETE', ['id' => $deleteId], null);
assert_error($deleteNoToken, 401, 'DELETE sans token');

$delete404 = invokeMoviesHandler($pdo, 'DELETE', ['id' => 99999]);
assert_error($delete404, 404, 'DELETE film introuvable');

$deleteOk = invokeMoviesHandler($pdo, 'DELETE', ['id' => $deleteId]);
assert_status($deleteOk, 200, 'DELETE OK');
assert_true(
    is_array($deleteOk['body']) && ($deleteOk['body']['success'] ?? '') === 'Film supprimé',
    'DELETE retourne success'
);

if (test_failures() === 0) {
    echo "\nTous les tests API movies sont passés.\n";
}

exit(test_failures() > 0 ? 1 : 0);
