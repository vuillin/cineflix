<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/bootstrap.php';
require_once dirname(__DIR__) . '/src/MovieRepository.php';
require_once dirname(__DIR__) . '/src/TmdbService.php';
require_once dirname(__DIR__) . '/src/Http/JsonResponse.php';
require_once dirname(__DIR__) . '/src/Http/Request.php';
require_once __DIR__ . '/movies.php';

$handle = movies_handlers($pdo);
$handle();
