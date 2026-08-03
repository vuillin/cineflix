CREATE INDEX IF NOT EXISTS idx_movies_sort_title ON movies(sort_title);
CREATE INDEX IF NOT EXISTS idx_movies_is_favorite ON movies(is_favorite);
CREATE INDEX IF NOT EXISTS idx_movies_tmdb_id ON movies(tmdb_id);
