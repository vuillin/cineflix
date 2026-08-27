<?php

declare(strict_types=1);

final class TmdbFetchResult
{
    public const ERROR_NOT_CONFIGURED = 'not_configured';
    public const ERROR_INVALID_ID = 'invalid_id';
    public const ERROR_NOT_FOUND = 'not_found';
    public const ERROR_UNAUTHORIZED = 'unauthorized';
    public const ERROR_NETWORK = 'network';
    public const ERROR_INVALID_RESPONSE = 'invalid_response';

    private function __construct(
        public readonly ?array $data,
        public readonly ?string $error,
    ) {}

    public static function ok(array $data): self
    {
        return new self($data, null);
    }

    public static function fail(string $error): self
    {
        return new self(null, $error);
    }

    public function isOk(): bool
    {
        return $this->error === null;
    }

    public function respondAsJsonError(): never
    {
        $map = [
            self::ERROR_NOT_CONFIGURED => ['Clé TMDB non configurée', 503],
            self::ERROR_INVALID_ID => ['ID TMDB invalide', 400],
            self::ERROR_NOT_FOUND => ['Film introuvable sur TMDB', 404],
            self::ERROR_UNAUTHORIZED => ['Clé TMDB invalide', 503],
            self::ERROR_NETWORK => ['TMDB indisponible', 502],
            self::ERROR_INVALID_RESPONSE => ['Réponse TMDB invalide', 502],
        ];

        [$message, $status] = $map[$this->error] ?? ['Erreur TMDB', 502];
        JsonResponse::error($message, $status);
    }
}