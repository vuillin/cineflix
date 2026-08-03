# Cineflix

Personal physical movie library with a Netflix-style UI.

## Setup

```bash
cp .env.example .env
# fill in TMDB_API_KEY and CINEFLIX_API_TOKEN

php -S localhost:8000
```

Open http://localhost:8000

Needs PHP 8.1+ with PDO SQLite.

## Config

- `TMDB_API_KEY` — optional; used to enrich movies when you add a `tmdb_id`
- `CINEFLIX_API_TOKEN` — required for create / update / delete

## Useful commands

```bash
php migrate.php
php tests/movie_repository_test.php
```

## Project layout

| Path | What |
|------|------|
| `index.php` | App shell |
| `api.php` | JSON API |
| `src/` | PHP (DB, movies, TMDB) |
| `assets/js/` | Frontend modules |
| `movies.sqlite` | Local database |
| `docs/api.md` | API notes |

## Images

Poster filenames in the DB point to `assets/images/small/` (e.g. `inception.webp`).
Backdrops live in `assets/images/backdrops/`.
