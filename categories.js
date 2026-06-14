const categoriesDefinition = [
    { titre: "Soirée frissons", filterFn: (f) => f.genres && f.genres.includes("Horreur") && f.vote_average >= 6.0 },
    { titre: "Les grandes épopées", filterFn: (f) => f.genres && f.genres.includes("Aventure") && f.runtime >= 140 },
    { titre: "Comédies familiales", filterFn: (f) => f.genres && f.genres.includes("Comédie") && f.genres.includes("Familial") },
    { titre: "Voyage dans l'espace", filterFn: (f) => f.genres && f.genres.includes("Science-Fiction") && f.keywords && (f.keywords.includes("space")) },
    { titre: "Action addictive", filterFn: (f) => f.genres && f.genres.includes("Action") && f.popularity > 50 },
    { titre: "Mystères à résoudre", filterFn: (f) => f.genres && f.genres.includes("Mystère") && f.genres.includes("Thriller") },

    { titre: "Nostalgie des années 80", filterFn: (f) => f.release_year >= 1980 && f.release_year <= 1989 },
    { titre: "Classiques des années 90", filterFn: (f) => f.release_year >= 1990 && f.release_year <= 1999 },
    { titre: "Le meilleur des années 2000", filterFn: (f) => f.release_year >= 2000 && f.release_year <= 2009 && f.vote_average > 7.0 },
    { titre: "Pépites des années 2010", filterFn: (f) => f.release_year >= 2010 && f.release_year <= 2019 && f.vote_average > 7.5 },
    { titre: "Nouveautés récentes", filterFn: (f) => f.release_year >= (new Date().getFullYear() - 3) },

    { titre: "Acclamés par la critique", filterFn: (f) => f.vote_average >= 8.2 && f.vote_count > 1000 },
    { titre: "Les blockbusters mondiaux", filterFn: (f) => f.revenue > 800000000 },
    { titre: "Petits budgets, grands films", filterFn: (f) => f.budget > 0 && f.budget < 10000000 && f.vote_average > 7.0 },
    { titre: "Les plus populaires actuellement", filterFn: (f) => f.popularity > 100 },

    { titre: "Pépites du cinéma français", filterFn: (f) => f.original_language === "fr" || (f.production_companies && f.production_companies.includes("France")) },
    { titre: "Chefs-d'œuvre japonais", filterFn: (f) => f.original_language === "ja" || (f.production_companies && f.production_companies.includes("Japan")) },
    { titre: "Cinéma coréen", filterFn: (f) => f.original_language === "ko" },
    { titre: "Cinéma indépendant", filterFn: (f) => f.budget > 0 && f.budget < 5000000 },

    { titre: "Films courts pour ce soir", filterFn: (f) => f.runtime > 0 && f.runtime <= 95 },
    { titre: "Longs opus", filterFn: (f) => f.runtime >= 180 },
    { titre: "Sagas et collections", filterFn: (f) => f.collection_name !== null && f.collection_name !== "" },

    { titre: "Magie de l'animation", filterFn: (f) => f.genres && f.genres.includes("Animation") && f.production_companies && (f.production_companies.includes("Pixar") || f.production_companies.includes("Disney") || f.production_companies.includes("Ghibli")) },
    { titre: "L'Univers Marvel", filterFn: (f) => f.production_companies && f.production_companies.includes("Marvel Studios") },
    { titre: "Films de Christopher Nolan", filterFn: (f) => f.director && f.director.includes("Christopher Nolan") },
    { titre: "Bandes originales mémorables", filterFn: (f) => f.composer && (f.composer.includes("Hans Zimmer") || f.composer.includes("John Williams")) },

    { titre: "Basé sur une histoire vraie", filterFn: (f) => f.keywords && (f.keywords.includes("based on true story") || f.keywords.includes("biography")) },
    { titre: "Super-héros & comics", filterFn: (f) => f.keywords && (f.keywords.includes("superhero") || f.keywords.includes("comic")) },
    { titre: "Post-apocalyptique", filterFn: (f) => f.keywords && (f.keywords.includes("post-apocalyptic") || f.keywords.includes("dystopia")) },
    { titre: "Voyages dans le temps", filterFn: (f) => f.keywords && f.keywords.includes("time travel") },

    { titre: "Films bouleversants", filterFn: (f) => f.genres && f.genres.includes("Drame") && f.keywords && f.keywords.includes("tragedy") },
    { titre: "Films cultes", filterFn: (f) => f.vote_count > 5000 && f.vote_average > 8.0 }
];

function getRandomCategories(allMovies, count = 10, minMovies = 4) {
    const shuffledCategories = [...categoriesDefinition].sort(() => 0.5 - Math.random());
    const selectedCategories = [];

    for (let currentCategory of shuffledCategories) {
        if (selectedCategories.length >= count) break;

        const matchedMovies = allMovies.filter(film => {
            try {
                return currentCategory.filterFn(film);
            } catch (e) {
                return false;
            }
        });

        if (matchedMovies.length >= minMovies) {
            const shuffledMatchedMovies = [...matchedMovies].sort(() => 0.5 - Math.random());

            selectedCategories.push({
                titre: currentCategory.titre,
                films: shuffledMatchedMovies
            });
        }
    }

    return selectedCategories;
}
