<section id="view-letterboxd" class="view-section hidden">
    <div class="letterboxd-import">
        <p class="letterboxd-import__hint">
            Importe ton export Letterboxd (<code>watched.csv</code>) pour mettre à jour les dates de visionnage.
        </p>
        <input type="file" id="letterboxd-csv-input" class="hidden" accept=".csv,text/csv">
        <button type="button" id="btn-letterboxd-import" class="btn-add-film">
            Importer watched.csv
        </button>
        <p id="letterboxd-import-status" class="letterboxd-import__status" aria-live="polite"></p>
    </div>
</section>
