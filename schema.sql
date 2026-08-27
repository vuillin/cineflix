CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    director TEXT,
    release_year INTEGER,
    poster TEXT,
    sort_title TEXT,
    tmdb_id INTEGER,
    genres TEXT,
    original_title TEXT,
    original_language TEXT,
    overview TEXT,
    tagline TEXT,
    status TEXT,
    runtime INTEGER,
    adult INTEGER,
    popularity REAL,
    vote_average REAL,
    vote_count INTEGER,
    budget INTEGER,
    revenue INTEGER,
    production_companies TEXT,
    cast_members TEXT,
    screenplay TEXT,
    producer TEXT,
    composer TEXT,
    keywords TEXT,
    collection_name TEXT,
    backdrop TEXT,
    certification TEXT,
    is_favorite INTEGER DEFAULT 0,
    dvd INTEGER DEFAULT 0,
    bluray INTEGER DEFAULT 0,
    steelbook INTEGER DEFAULT 0,
    coffret INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_movies_sort_title ON movies(sort_title);
CREATE INDEX IF NOT EXISTS idx_movies_is_favorite ON movies(is_favorite);
CREATE INDEX IF NOT EXISTS idx_movies_tmdb_id ON movies(tmdb_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_movies_tmdb_id_unique
    ON movies(tmdb_id)
    WHERE tmdb_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_movies_poster_unique
    ON movies(poster)
    WHERE poster IS NOT NULL AND poster != '';
