# Cineflix

A Netflix-style UI for a physical Blu-ray/DVD collection. PHP + vanilla JS on the backend, SQLite for storage.

## Requirements

PHP 8.1+ with PDO SQLite and the `curl` extension (TMDB calls).

## Setup

```bash
cp .env.example .env
# set TMDB_API_KEY and CINEFLIX_API_TOKEN

php -S localhost:8000
```

Open http://localhost:8000

On first run, `movies.sqlite` is created automatically from `schema.sql`.

## Environment

| Variable | Required | Notes |
|----------|----------|-------|
| `TMDB_API_KEY` | No | Fetches metadata when adding a film by `tmdb_id` |
| `CINEFLIX_API_TOKEN` | Yes (writes) | Sent as `X-Cineflix-Token` on POST / PUT / PATCH / DELETE |

GET is public. Without a TMDB key, preview and add-by-TMDB won't work.

## Tests

```bash
php tests/run.php
```

Runs repository and API tests against an in-memory SQLite DB. Your `movies.sqlite` is not touched.

Individual suites:

```bash
php tests/movie_repository_test.php
php tests/api_movies_test.php
```

## Images

Filenames in the DB, files on disk. Three folders:

**Posters** — `assets/images/small/`  
Store as `.webp` (300×450). In the DB, keep just the filename (`inception.webp`).  
When adding a film, enter the name without extension (`inception`) — `.webp` is added automatically.

Convert a file:

```bash
./scripts/convert-poster.sh path/to/poster.jpg my_movie
```

**Backdrops** — `assets/images/backdrops/`  
Naming convention: `{tmdb_id}_backdrop.jpg` (e.g. `155_backdrop.jpg`). Add the file yourself; the DB stores the filename only.

**Hero banner** — `assets/images/heroes/`  
Homepage carousel images (`hero_1.webp`, …). Wired in `assets/js/views/accueil.js` with a `tmdbId` for the info button. Not stored in the DB.

Genre picker banners live in `assets/images/bannieres/`.

## Database

Schema lives in `schema.sql` (tables, indexes, unique constraints on `tmdb_id` and `poster`). Applied on each DB connection via `CREATE … IF NOT EXISTS`.

To change the schema, edit `schema.sql`.

## Project layout

| Path | Role |
|------|------|
| `index.php` | App shell |
| `api.php` | JSON API entry |
| `schema.sql` | Database schema |
| `src/` | PHP (repository, TMDB, HTTP helpers) |
| `api/` | API route handlers |
| `assets/js/` | Frontend ES modules |
| `assets/css/` | Styles |
| `components/` | PHP partials (modals, header) |
| `views/` | Page sections |
| `movies.sqlite` | Your library (local, not committed) |
| `docs/api.md` | API reference |
| `tests/` | CLI tests |
| `scripts/` | Helper scripts |
| `logs/` | App error log (`app.log`) |

## API

See [docs/api.md](docs/api.md).
