
/**
 * 🔄 Fonction pour récupérer les films depuis TMDB.
 * @param {string} category - Catégorie de films ("popular", "now_playing").
 * @param {number} limit - Nombre max de films à récupérer.
 * @returns {Promise<Array>} - Liste des films récupérés.
 */
async function fetchMovies(category, limit = 10) {
    console.log(`📡 Demande des films en catégorie "${category}"...`);

    try {
        const response = await fetch(`${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=fr-FR&page=1`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log(`🎥 Films récupérés (${category}):`, data.results); // Vérifie les films

        return data.results ? data.results.slice(0, limit) : [];
    } catch (error) {
        console.error(`❌ Erreur lors de la récupération des films (${category}) :`, error);
        return [];
    }
}

/**
 * 🎬 Génère un slider Swiper avec les films récupérés.
 * @param {string} category - Catégorie des films.
 * @param {string} swiperSelector - Sélecteur CSS du slider.
 */
async function createMovieSlider(category, swiperSelector) {
    console.log(`🚀 Création du slider pour "${category}" dans "${swiperSelector}"...`);

    const movies = await fetchMovies(category, 10);
    const swiperWrapper = document.querySelector(`${swiperSelector} .swiper-wrapper`);

    if (!swiperWrapper) {
        console.error(`❌ Élément ${swiperSelector} introuvable !`);
        return;
    }

    swiperWrapper.innerHTML = ""; // Nettoyage avant ajout

    if (movies.length === 0) {
        console.warn(`⚠️ Aucun film trouvé pour "${category}".`);
        swiperWrapper.innerHTML = `<p class="error-message">Aucun film trouvé. 😢</p>`;
        return;
    }

    movies.forEach((movie, index) => {
        console.log(`📌 Ajout du film ${index + 1}: ${movie.title}`);

        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        const imageUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "images/placeholder.jpg";
        const title = movie.title || "Titre inconnu";
        const releaseDate = movie.release_date ? ` ${movie.release_date}` : "Date inconnue";
        const rating = movie.vote_average ? ` ${movie.vote_average.toFixed(1)}/10` : "Pas de note";

        slide.innerHTML = `
            <img src="${imageUrl}" alt="${title}">
            <div class="movie-info">
                <div class="left-info">
                    <p class="movie-title-now">${title}</p>
                    <p class="movie-date">${releaseDate}</p>
                </div>
                <div class="right-info">
                    <p class="movie-rating">${rating}</p>
                </div>
            </div>
        `;

        swiperWrapper.appendChild(slide);
    });

    console.log(`✅ Films injectés dans ${swiperSelector}.`);

    // Initialisation du Swiper après injection
    console.log(`🎢 Initialisation du Swiper pour "${swiperSelector}"...`);
    new Swiper(swiperSelector, {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 1,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 800,
        navigation: {
            nextEl: `${swiperSelector} .swiper-button-next`,
            prevEl: `${swiperSelector} .swiper-button-prev`,
        },
        breakpoints: {
            1024: { slidesPerView: 6 },
            768: { slidesPerView: 3 },
            480: { slidesPerView: 2 },
        },
    });

    console.log(`🎯 Swiper "${swiperSelector}" prêt !`);
}

// 🏁 Exécuter le slider "Actuellement en salle" au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    console.log("📜 DOM chargé, lancement du script...");
    createMovieSlider("now_playing", ".swiper-now-playing");
});
