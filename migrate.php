<?php

declare(strict_types=1);

require_once __DIR__ . '/src/bootstrap.php';

$migrationsDir = __DIR__ . '/migrations';
if (!is_dir($migrationsDir)) {
    fwrite(STDERR, "Aucun dossier migrations/\n");
    exit(1);
}

$files = glob($migrationsDir . '/*.sql');
sort($files);

$applied = $pdo->query('SELECT migration FROM schema_migrations')->fetchAll(PDO::FETCH_COLUMN);
$appliedMap = array_flip($applied);

$ran = 0;
foreach ($files as $file) {
    $name = basename($file);
    if (isset($appliedMap[$name])) {
        echo "skip  {$name}\n";
        continue;
    }

    $sql = file_get_contents($file);
    if ($sql === false) {
        fwrite(STDERR, "Impossible de lire {$name}\n");
        exit(1);
    }

    try {
        $pdo->beginTransaction();
        $pdo->exec($sql);
        $stmt = $pdo->prepare('INSERT INTO schema_migrations (migration) VALUES (:migration)');
        $stmt->execute([':migration' => $name]);
        $pdo->commit();
        echo "apply {$name}\n";
        $ran++;
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        fwrite(STDERR, "Échec {$name}: " . $e->getMessage() . "\n");
        exit(1);
    }
}

echo $ran === 0 ? "Rien à migrer.\n" : "{$ran} migration(s) appliquée(s).\n";
