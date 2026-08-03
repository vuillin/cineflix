<section id="view-collection" class="view-section">
    <section id="section-ajout" class="hidden">
        <h2>Ajouter un film</h2>
        <form id="form-ajout-film">
            <div class="form-group">
                <label for="tmdb_id">ID TMDB</label>
                <input type="number" id="tmdb_id" name="tmdb_id" required min="1" placeholder="Ex: 550">
            </div>
            <div class="form-group">
                <label for="poster">Affiche</label>
                <input type="text" id="poster" name="poster" placeholder="nom du fichier (sans .webp)">
            </div>
            <p id="ajout-film-error" class="form-error hidden" role="alert"></p>
            <button type="submit">Ajouter</button>
        </form>
    </section>

    <ul id="liste-films" class="movies-grid">
        <li><em>Le chargement des films n'est pas encore programmé...</em></li>
    </ul>
</section>
