<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/GenreNormalizer.php';
require_once dirname(__DIR__) . '/src/MovieRepository.php';
require_once dirname(__DIR__) . '/src/TmdbFetchResult.php';
require_once dirname(__DIR__) . '/src/TmdbService.php';
require_once dirname(__DIR__) . '/src/Logger.php';
require_once dirname(__DIR__) . '/src/Http/JsonResponseException.php';
require_once dirname(__DIR__) . '/src/Http/JsonResponse.php';
require_once dirname(__DIR__) . '/src/Http/Request.php';
require_once dirname(__DIR__) . '/src/Http/Input.php';
require_once dirname(__DIR__) . '/api/movies.php';
require_once __DIR__ . '/FakeTmdbService.php';

function withApiTestEnv(callable $callback): mixed
{
    $previousToken = getenv('CINEFLIX_API_TOKEN');
    putenv('CINEFLIX_API_TOKEN=test-token');

    Request::resetTestState();
    JsonResponse::enableTestMode(true);
    unset($_SERVER['HTTP_X_CINEFLIX_TOKEN']);

    try {
        return $callback();
    } finally {
        JsonResponse::enableTestMode(false);
        Request::resetTestState();
        unset($_SERVER['HTTP_X_CINEFLIX_TOKEN']);

        if ($previousToken === false) {
            putenv('CINEFLIX_API_TOKEN');
        } else {
            putenv('CINEFLIX_API_TOKEN=' . $previousToken);
        }
    }
}

/**
 * @param array<string, mixed>|null $body
 * @return array{status: int, body: mixed}
 */
function invokeMoviesHandler(
    PDO $pdo,
    string $method,
    ?array $body = null,
    ?string $token = 'test-token',
    ?object $tmdb = null,
): array {
    return withApiTestEnv(function () use ($pdo, $method, $body, $token, $tmdb): array {
        Request::setTestMethod($method);

        if ($body !== null) {
            Request::setTestBody(json_encode($body, JSON_THROW_ON_ERROR));
        }

        if ($token !== null) {
            $_SERVER['HTTP_X_CINEFLIX_TOKEN'] = $token;
        }

        try {
            $handler = movies_handlers($pdo, $tmdb);
            $handler();
            throw new RuntimeException('Handler did not send a JSON response');
        } catch (JsonResponseException $e) {
            return [
                'status' => $e->status,
                'body' => $e->data,
            ];
        }
    });
}

function assert_status(array $response, int $expected, string $message): void
{
    assert_true($response['status'] === $expected, $message . " (HTTP {$response['status']})");
}

function assert_error(array $response, int $expectedStatus, string $message): void
{
    assert_status($response, $expectedStatus, $message);
    assert_true(
        is_array($response['body']) && isset($response['body']['error']) && $response['body']['error'] !== '',
        $message . ' retourne une erreur JSON'
    );
}

function seedMovie(PDO $pdo, array $overrides = []): int
{
    $repo = new MovieRepository($pdo);

    return $repo->create(array_merge([
        'title' => 'Film seed',
        'director' => 'Seed Director',
        'release_year' => 2020,
        'poster' => 'seed_' . random_int(1000, 9999) . '.webp',
        'tmdb_id' => random_int(100000, 999999),
        'is_favorite' => 0,
        'bluray' => 1,
    ], $overrides));
}
