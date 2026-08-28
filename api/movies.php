<?php

declare(strict_types=1);

/**
 * @return callable
 */
/**
 * @param TmdbService|object|null $tmdb Test double allowed (must expose getMovieDetails()).
 * @return callable
 */
function movies_handlers(PDO $pdo, $tmdb = null): callable
{
    $repo = new MovieRepository($pdo);
    $tmdb = $tmdb ?? new TmdbService();

    return static function () use ($repo, $tmdb): void {
        $method = Request::method();

        try {
            if ($method === 'GET') {
                JsonResponse::send($repo->findAll());
            }

            if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
                Request::requireWriteToken();
            }

            $data = Request::jsonBody();

            if ($method === 'POST') {
                $tmdbId = Input::requirePositiveInt($data['tmdb_id'] ?? null, 'tmdb_id');
                $formats = Input::readFormatFlags($data);

                if ($repo->findByTmdbId($tmdbId) !== null) {
                    JsonResponse::error('Un film avec cet ID TMDB existe déjà', 409);
                }

                $tmdbResult = $tmdb->getMovieDetails($tmdbId);
                if (!$tmdbResult->isOk()) {
                    $tmdbResult->respondAsJsonError();
                }

                $tmdbDetails = $tmdbResult->data;
                if (empty($tmdbDetails['title'])) {
                    JsonResponse::error('Film introuvable sur TMDB', 404);
                }

                $payload = TmdbService::mergeMovieData($data, $tmdbDetails);

                if (isset($payload['backdrop']) && is_string($payload['backdrop']) && str_starts_with($payload['backdrop'], '/')) {
                    $payload['backdrop'] = null;
                }

                $poster = MovieRepository::normalizePosterFilename(
                    isset($payload['poster']) ? (string) $payload['poster'] : null
                );

                if ($poster !== null && $repo->findByPoster($poster) !== null) {
                    JsonResponse::error('Cette affiche est déjà utilisée', 409);
                }

                $payload['poster'] = $poster;
                $payload['tmdb_id'] = $tmdbId;
                $payload = array_merge($payload, $formats);

                $repo->create($payload);
                JsonResponse::send(['success' => 'Film ajouté']);
            }

            if ($method === 'PATCH') {
                $id = Input::requirePositiveInt($data['id'] ?? null, 'id');

                if (!array_key_exists('is_favorite', $data)) {
                    JsonResponse::error('is_favorite est obligatoire');
                }

                $isFavorite = Input::requireFlag($data['is_favorite'], 'is_favorite');

                if ($repo->findById($id) === null) {
                    JsonResponse::error('Film introuvable', 404);
                }

                $repo->updateFavorite($id, $isFavorite);
                JsonResponse::send(['success' => 'Favori mis à jour']);
            }

            if ($method === 'PUT') {
                $id = Input::requirePositiveInt($data['id'] ?? null, 'id');

                if (empty($data['title']) || !is_string($data['title'])) {
                    JsonResponse::error('Le titre est obligatoire pour modifier');
                }

                $existing = $repo->findById($id);
                if ($existing === null) {
                    JsonResponse::error('Film introuvable', 404);
                }

                $formats = Input::readFormatFlags($data);

                $payload = array_merge($existing, $data);
                $payload['id'] = $id;
                $payload = array_merge($payload, $formats);

                if (array_key_exists('tmdb_id', $data) && $data['tmdb_id'] !== '' && $data['tmdb_id'] !== null) {
                    $tmdbId = Input::requirePositiveInt($data['tmdb_id'], 'tmdb_id');

                    if ($repo->findByTmdbIdForOther($tmdbId, $id) !== null) {
                        JsonResponse::error('Un film avec cet ID TMDB existe déjà', 409);
                    }

                    $payload['tmdb_id'] = $tmdbId;
                }

                $poster = MovieRepository::normalizePosterFilename(
                    isset($payload['poster']) ? (string) $payload['poster'] : null
                );

                if ($poster !== null && $repo->findByPosterForOther($poster, $id) !== null) {
                    JsonResponse::error('Cette affiche est déjà utilisée', 409);
                }

                $payload['poster'] = $poster;

                $repo->update($payload);
                JsonResponse::send(['success' => 'Film modifié']);
            }

            if ($method === 'DELETE') {
                $id = Input::requirePositiveInt($data['id'] ?? null, 'id');

                if ($repo->findById($id) === null) {
                    JsonResponse::error('Film introuvable', 404);
                }

                $repo->delete($id);
                JsonResponse::send(['success' => 'Film supprimé']);
            }

            JsonResponse::error('Méthode non autorisée', 405);
        } catch (JsonResponseException $e) {
            throw $e;
        } catch (Throwable $e) {
            Logger::error('API movies ' . $method, $e);
            JsonResponse::error('Erreur serveur', 500);
        }
    };
}
