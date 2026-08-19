<?php

declare(strict_types=1);

/**
 * @return callable
 */
function movies_handlers(PDO $pdo): callable
{
    $repo = new MovieRepository($pdo);
    $tmdb = new TmdbService();

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
                $tmdbId = isset($data['tmdb_id']) ? (int) $data['tmdb_id'] : 0;
                if ($tmdbId <= 0) {
                    JsonResponse::error('ID TMDB requis');
                }

                if ($repo->findByTmdbId($tmdbId) !== null) {
                    JsonResponse::error('Un film avec cet ID TMDB existe déjà', 409);
                }

                $tmdbDetails = $tmdb->getMovieDetails($tmdbId);
                if ($tmdbDetails === null || empty($tmdbDetails['title'])) {
                    JsonResponse::error('Impossible de récupérer le film sur TMDB');
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

                $repo->create($payload);
                JsonResponse::send(['success' => 'Film ajouté']);
            }

            if ($method === 'PATCH') {
                if (empty($data['id'])) {
                    JsonResponse::error("L'ID est obligatoire pour modifier le favori");
                }
                if (!array_key_exists('is_favorite', $data)) {
                    JsonResponse::error('is_favorite est obligatoire');
                }

                $id = (int) $data['id'];
                if ($repo->findById($id) === null) {
                    JsonResponse::error('Film introuvable', 404);
                }

                $repo->updateFavorite($id, (int) $data['is_favorite']);
                JsonResponse::send(['success' => 'Favori mis à jour']);
            }

            if ($method === 'PUT') {
                if (empty($data['id'])) {
                    JsonResponse::error("L'ID est obligatoire pour modifier");
                }
                if (empty($data['title'])) {
                    JsonResponse::error('Le titre est obligatoire pour modifier');
                }

                $id = (int) $data['id'];
                $existing = $repo->findById($id);
                if ($existing === null) {
                    JsonResponse::error('Film introuvable', 404);
                }

                $payload = array_merge($existing, $data);
                $payload['id'] = $id;

                if (array_key_exists('tmdb_id', $payload) && $payload['tmdb_id'] !== '' && $payload['tmdb_id'] !== null) {
                    $tmdbId = (int) $payload['tmdb_id'];
                    if ($tmdbId <= 0) {
                        JsonResponse::error('ID TMDB invalide');
                    }
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

                $repo->update($payload);
                JsonResponse::send(['success' => 'Film modifié !']);
            }

            if ($method === 'DELETE') {
                if (empty($data['id'])) {
                    JsonResponse::error("L'ID est obligatoire pour supprimer");
                }

                $repo->delete((int) $data['id']);
                JsonResponse::send(['success' => 'Film supprimé avec succès !']);
            }

            JsonResponse::error('Méthode non autorisée', 405);
        } catch (Throwable $e) {
            JsonResponse::error('Erreur serveur', 500);
        }
    };
}
