<?php

declare(strict_types=1);

/**
 * Lance tous les tests CLI du projet.
 * Usage : php tests/run.php
 * Code de sortie : 0 si tout passe, 1 sinon.
 */

$testFiles = [
    __DIR__ . '/movie_repository_test.php',
    __DIR__ . '/api_movies_test.php',
];

$failedSuites = 0;

foreach ($testFiles as $file) {
    $name = basename($file);
    echo "=== {$name} ===\n";

    passthru('php ' . escapeshellarg($file), $exitCode);

    if ($exitCode !== 0) {
        $failedSuites++;
    }

    echo "\n";
}

if ($failedSuites === 0) {
    echo "Tous les tests sont passés.\n";
    exit(0);
}

fwrite(STDERR, "{$failedSuites} suite(s) en échec.\n");
exit(1);
