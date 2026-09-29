<section id="view-letterboxd" class="view-section hidden">
    <div class="letterboxd-import">
        <div class="letterboxd-import__actions">
            <input type="file" id="letterboxd-watched-input" class="hidden" accept=".csv,text/csv">
            <input type="file" id="letterboxd-ratings-input" class="hidden" accept=".csv,text/csv">
            <button type="button" id="btn-letterboxd-watched" class="btn-add-film">
                Importer watched.csv
            </button>
            <button type="button" id="btn-letterboxd-ratings" class="btn-add-film">
                Importer ratings.csv
            </button>
        </div>
        <p id="letterboxd-import-status" class="letterboxd-import__status" aria-live="polite"></p>
    </div>

    <ul id="liste-letterboxd" class="movies-grid movies-grid--compact"></ul>
</section>
