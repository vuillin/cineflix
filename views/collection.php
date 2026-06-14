<section id="view-collection" class="view-section">
    <section id="section-ajout" class="hidden">
        <h2>Ajouter un nouveau film</h2>
        <form id="form-ajout-film">
            <div>
                <label for="title">Titre du film * :</label>
                <input type="text" id="title" name="title" required>
            </div>
            <div>
                <label for="director">Réalisateur :</label>
                <input type="text" id="director" name="director">
            </div>
            <div>
                <label for="release_year">Année de sortie :</label>
                <input type="number" id="release_year" name="release_year">
            </div>
            <div>
                <label for="tmdb_id">ID TMDB (Optionnel pour l'instant) :</label>
                <input type="number" id="tmdb_id" name="tmdb_id">
            </div>
            <div>
                <label for="poster">Nom du fichier de l'affiche (sans le .webp) :</label>
                <input type="text" id="poster" name="poster">
            </div>
            <div style="display: flex; gap: 10px;">
                <button type="submit" style="flex: 1;">Enregistrer le film</button>
                <button type="button" id="btn-delete" class="hidden"
                    style="background-color: #d9534f; border-color: #d43f3a;">Supprimer</button>
            </div>
        </form>
    </section>

    <ul id="liste-films" class="movies-grid">
        <li><em>Le chargement des films n'est pas encore programmé...</em></li>
    </ul>
</section>