# API

All requests go to `api.php` and return JSON.

## Auth

Read is open. Writes need this header:

```
X-Cineflix-Token: <your CINEFLIX_API_TOKEN>
```

## Endpoints

| Method | Body | What it does |
|--------|------|----------------|
| `GET` | — | List all movies |
| `POST` | `{ tmdb_id, poster? }` | Create a movie from TMDB. Metadata comes from TMDB; `poster` is optional (local filename). |
| `PUT` | movie + `id` | Update a movie (`title` required) |
| `PATCH` | `{ id, is_favorite }` | Toggle favorite |
| `DELETE` | `{ id }` | Delete a movie |

## Responses

- OK: `{ "success": "..." }`
- Error: `{ "error": "..." }`

## Useful fields

`title`, `director`, `release_year`, `poster`, `backdrop`, `tmdb_id`, `genres`, `overview`, `cast_members`, `runtime`, `is_favorite`, `dvd`, `bluray`, `steelbook`, `coffret`

`poster` is just the filename inside `assets/images/small/`.
