<?php

declare(strict_types=1);

$testFailures = 0;

function assert_true(bool $cond, string $message): void
{
    global $testFailures;

    if (!$cond) {
        fwrite(STDERR, "FAIL: {$message}\n");
        $testFailures++;
        return;
    }

    echo "OK: {$message}\n";
}

function test_failures(): int
{
    global $testFailures;

    return $testFailures;
}

function createTestPdo(): PDO
{
    $pdo = new PDO('sqlite::memory:');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $schema = file_get_contents(dirname(__DIR__) . '/schema.sql');
    assert_true($schema !== false && $schema !== '', 'schema.sql lisible');
    $pdo->exec($schema);

    return $pdo;
}
