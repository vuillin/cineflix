<?php

declare(strict_types=1);

function letterboxd_watches_handler(PDO $pdo): callable
{
    $repo = new MovieRepository($pdo);

    return static function () use ($repo): void {
        try {
            if (Request::method() !== 'POST') {
                JsonResponse::error('Méthode non autorisée', 405);
            }

            Request::requireWriteToken();
            $data = Request::jsonBody();
            $watches = $data['watches'] ?? null;

            if (!is_array($watches)) {
                JsonResponse::error('watches doit être un tableau');
            }

            $bestByMovieId = []; // id => date
            $unmatched = [];

            foreach ($watches as $watch) {
                $title = isset($watch['title']) && is_string($watch['title'])
                    ? trim($watch['title']) : '';
                $year = isset($watch['year']) ? (int) $watch['year'] : 0;
                $date = isset($watch['date']) && is_string($watch['date'])
                    ? trim($watch['date']) : '';

                if ($title === '' || $year < 1 || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                    continue;
                }

                $movie = $repo->findByTitleAndYear($title, $year);
                if ($movie === null) {
                    $unmatched[] = ['title' => $title, 'year' => $year];
                    continue;
                }

                $id = (int) $movie['id'];
                if (!isset($bestByMovieId[$id]) || $date > $bestByMovieId[$id]) {
                    $bestByMovieId[$id] = $date;
                }
            }

            $updated = 0;
            foreach ($bestByMovieId as $id => $date) {
                $movie = $repo->findById($id);
                $current = $movie['last_watched_at'] ?? null;
                if ($current !== null && $current !== '' && $current >= $date) {
                    continue;
                }
                $repo->updateLastWatched($id, $date);
                $updated++;
            }

            JsonResponse::send([
                'success' => 'Import Letterboxd terminé',
                'updated' => $updated,
                'unmatched' => count($unmatched),
                'unmatched_samples' => array_slice($unmatched, 0, 20),
            ]);
        } catch (JsonResponseException $e) {
            throw $e;
        } catch (Throwable $e) {
            Logger::error('API letterboxd_watches', $e);
            JsonResponse::error('Erreur serveur', 500);
        }
    };
}