<?php

declare(strict_types=1);

function letterboxd_ratings_handler(PDO $pdo): callable
{
    $repo = new MovieRepository($pdo);

    return static function () use ($repo): void {
        try {
            if (Request::method() !== 'POST') {
                JsonResponse::error('Méthode non autorisée', 405);
            }

            Request::requireWriteToken();
            $data = Request::jsonBody();
            $ratings = $data['ratings'] ?? null;

            if (!is_array($ratings)) {
                JsonResponse::error('ratings doit être un tableau');
            }

            $bestByMovieId = [];
            $unmatched = [];

            foreach ($ratings as $entry) {
                $title = isset($entry['title']) && is_string($entry['title'])
                    ? trim($entry['title']) : '';
                $year = isset($entry['year']) ? (int) $entry['year'] : 0;
                $date = isset($entry['date']) && is_string($entry['date'])
                    ? trim($entry['date']) : '';
                $rating = isset($entry['rating']) ? (float) $entry['rating'] : 0.0;

                if (
                    $title === ''
                    || $year < 1
                    || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)
                    || $rating < 0.5
                    || $rating > 5
                ) {
                    continue;
                }

                $movie = $repo->findByTitleAndYear($title, $year);
                if ($movie === null) {
                    $unmatched[] = ['title' => $title, 'year' => $year];
                    continue;
                }

                $id = (int) $movie['id'];
                if (!isset($bestByMovieId[$id]) || $date > $bestByMovieId[$id]['date']) {
                    $bestByMovieId[$id] = [
                        'date' => $date,
                        'rating' => $rating,
                    ];
                }
            }

            $updated = 0;
            foreach ($bestByMovieId as $id => $payload) {
                $repo->updateUserRating($id, $payload['rating']);
                $updated++;
            }

            JsonResponse::send([
                'success' => 'Import notes Letterboxd terminé',
                'updated' => $updated,
                'unmatched' => count($unmatched),
                'unmatched_samples' => array_slice($unmatched, 0, 20),
            ]);
        } catch (JsonResponseException $e) {
            throw $e;
        } catch (Throwable $e) {
            Logger::error('API letterboxd_ratings', $e);
            JsonResponse::error('Erreur serveur', 500);
        }
    };
}
