<?php

$dbFile = __DIR__ . "/movies.sqlite";

try {
    $pdo = new PDO("sqlite:" . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tmdb_id INTEGER,
        title TEXT NOT NULL,
        sort_title TEXT,
        director TEXT,
        release_year INTEGER,
        poster TEXT
        )
    ");

} catch (PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
    die();
}

?>
