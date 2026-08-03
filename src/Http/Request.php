<?php

declare(strict_types=1);

final class Request
{
    public static function method(): string
    {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    /**
     * @return array<string, mixed>
     */
    public static function jsonBody(): array
    {
        $raw = file_get_contents('php://input');
        if ($raw === false || $raw === '') {
            return [];
        }

        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    public static function header(string $name): ?string
    {
        $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
        if (isset($_SERVER[$serverKey]) && is_string($_SERVER[$serverKey])) {
            return $_SERVER[$serverKey];
        }

        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            foreach ($headers as $key => $value) {
                if (strcasecmp((string) $key, $name) === 0) {
                    return (string) $value;
                }
            }
        }

        return null;
    }

    public static function requireWriteToken(): void
    {
        $expected = getenv('CINEFLIX_API_TOKEN') ?: '';
        if ($expected === '') {
            JsonResponse::error('CINEFLIX_API_TOKEN manquant côté serveur.', 500);
        }

        $provided = self::header('X-Cineflix-Token');
        if ($provided === null || !hash_equals($expected, $provided)) {
            JsonResponse::error('Token API invalide ou manquant.', 401);
        }
    }
}
