<?php

header('Content-Type: application/json');

require_once "database.php";


function genererSortTitle($titre)
{
    $pattern = '/^(Le |La |Les |L\'|Un |Une |Des |The |A |An )/i';
    $sort_title = preg_replace($pattern, '', $titre);
    return trim($sort_title);
}


$method = $_SERVER["REQUEST_METHOD"];


if ($method == "GET") {
    $stmt = $pdo->query("SELECT * FROM movies ORDER BY sort_title COLLATE NOCASE ASC");
    $movies = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($movies);
    exit;
}


if ($method == "POST") {
    $donnesBrutes = file_get_contents("php://input");
    $donnes = json_decode($donnesBrutes, true);
    $sortTitle = genererSortTitle($donnes['title']);

    if (empty($donnes['title'])) {
        http_response_code(400);
        echo json_encode(['erreur' => 'Le titre est obligatoire']);
        exit;
    }

    $sql = "INSERT INTO movies (title, sort_title, director, release_year, poster, tmdb_id, genres, backdrop, certification, is_favorite, dvd, bluray, steelbook, coffret) VALUES (:titre, :sort_title, :realisateur, :annee, :poster, :tmdb_id, :genres, :backdrop, :certification, :is_favorite, :dvd, :bluray, :steelbook, :coffret)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':titre' => $donnes['title'],
        ':sort_title' => $sortTitle,
        ':realisateur' => $donnes['director'],
        ':annee' => $donnes['release_year'],
        ':poster' => $donnes['poster'] ?? null,
        ':tmdb_id' => $donnes['tmdb_id'] ?? null,
        ':genres' => $donnes['genres'] ?? null,
        ':backdrop' => $donnes['backdrop'] ?? null,
        ':certification' => $donnes['certification'] ?? null,
        ':is_favorite' => $donnes['is_favorite'] ?? 0,
        ':dvd' => $donnes['dvd'] ?? 0,
        ':bluray' => $donnes['bluray'] ?? 0,
        ':steelbook' => $donnes['steelbook'] ?? 0,
        ':coffret' => $donnes['coffret'] ?? 0
    ]);

    echo json_encode(['succes' => 'Film ajouté avec brio !']);
    exit;
}


if ($method == "PUT") {
    $donnesBrutes = file_get_contents("php://input");
    $donnes = json_decode($donnesBrutes, true);
    $sortTitle = genererSortTitle($donnes['title']);

    if (empty($donnes['id'])) {
        http_response_code(400);
        echo json_encode(['erreur' => 'L ID (identifiant) est obligatoire pour modifier']);
        exit;
    }

    if (empty($donnes['title'])) {
        http_response_code(400);
        echo json_encode(['erreur' => 'Le titre est obligatoire pour modifier']);
        exit;
    }

    $sql = "UPDATE movies SET title = :title, sort_title = :sort_title, director = :director, release_year = :release_year, poster = :poster, tmdb_id = :tmdb_id, genres = :genres, backdrop = :backdrop, certification = :certification, is_favorite = :is_favorite, dvd = :dvd, bluray = :bluray, steelbook = :steelbook, coffret = :coffret WHERE id = :id";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id' => $donnes['id'],
        ':title' => $donnes['title'],
        ':sort_title' => $sortTitle,
        ':director' => $donnes['director'] ?? null,
        ':release_year' => $donnes['release_year'] ?? null,
        ':poster' => $donnes['poster'] ?? null,
        ':tmdb_id' => $donnes['tmdb_id'] ?? null,
        ':genres' => $donnes['genres'] ?? null,
        ':backdrop' => $donnes['backdrop'] ?? null,
        ':certification' => $donnes['certification'] ?? null,
        ':is_favorite' => $donnes['is_favorite'] ?? 0,
        ':dvd' => $donnes['dvd'] ?? 0,
        ':bluray' => $donnes['bluray'] ?? 0,
        ':steelbook' => $donnes['steelbook'] ?? 0,
        ':coffret' => $donnes['coffret'] ?? 0
    ]);

    echo json_encode(['succes' => 'Film modifié !']);
    exit;
}

if ($method == "DELETE") {
    $donnesBrutes = file_get_contents("php://input");
    $donnes = json_decode($donnesBrutes, true);

    if (empty($donnes['id'])) {
        http_response_code(400);
        echo json_encode(['erreur' => 'L ID (identifiant) est obligatoire pour supprimer']);
        exit;
    }

    $sql = "DELETE FROM movies WHERE id = :id";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id' => $donnes['id']
    ]);

    echo json_encode(['succes' => 'Film supprimé avec succès !']);
    exit;
}

http_response_code(405);
echo json_encode(['erreur' => 'Méthode non autorisée']);




?>
