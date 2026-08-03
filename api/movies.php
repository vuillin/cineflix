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
                if (empty($data['title'])) {
                    JsonResponse::error('Le titre est obligatoire');
                }

                $payload = $data;
                $tmdbId = isset($data['tmdb_id']) ? (int) $data['tmdb_id'] : 0;
                if ($tmdbId > 0) {
                    $tmdbDetails = $tmdb->getMovieDetails($tmdbId);
                    if ($tmdbDetails !== null) {
                        $payload = TmdbService::mergeMovieData($data, $tmdbDetails);
                    }
                }

                $repo->create($payload);
                JsonResponse::send(['success' => 'Film ajouté avec brio !']);
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
