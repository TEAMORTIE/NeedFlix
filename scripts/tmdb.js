const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488"; // ⚠️ Clé à sécuriser côté backend !
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"; // URL des affiches de films

/**
 * 🔄 Fonction pour récupérer les films populaires depuis TMDB.
 * @returns {Promise<Array>} - Liste des films populaires (max 10).
 */
async function fetchPopularMovies() {
    console.log("📡 Récupération des films populaires...");
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("🎥 Films récupérés :", data.results);

        return data.results ? data.results.slice(0, 10) : [];
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des films :", error);
        return [];
    }
}

/**
 * 🎬 Affiche les films récupérés dans le Swiper.
 */
async function displayMoviesInSwiper() {
    const movies = await fetchPopularMovies();
    const swiperWrapper = document.querySelector(".swiper-wrapper");

    if (!swiperWrapper) {
        console.error("❌ Élément .swiper-wrapper introuvable !");
        return;
    }

    swiperWrapper.innerHTML = ""; // Nettoyage du slider avant d'ajouter les films

    if (movies.length === 0) {
        console.warn("⚠️ Aucun film trouvé.");
        swiperWrapper.innerHTML = `<p class="error-message">Aucun film trouvé. 😢</p>`;
        return;
    }

    movies.forEach((movie, index) => {
        console.log(`📌 Ajout du film ${index + 1}: ${movie.title}`);

        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        // Vérification si l'image existe
        const imageUrl = movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : "images/placeholder.jpg";
        const description = movie.overview ? movie.overview.slice(0, 100) + "..." : "Aucune description disponible.";

        slide.innerHTML = `
            <img src="${imageUrl}" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-description">${description}</div>
            <a class="BO-button" href=""><i class="fa-solid fa-play"></i><p>Bande-Annonce</p></a>
        `;

        swiperWrapper.appendChild(slide);
    });

    console.log("✅ Films injectés dans le Swiper.");

    // Initialiser Swiper après avoir ajouté les films
    setTimeout(() => {
        console.log("🎢 Initialisation du Swiper...");
        new Swiper(".swiper-big", {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            speed: 800,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
        console.log("🎯 Swiper prêt !");
    }, 100);
}

// 🏁 Exécuter tout le script après le chargement du DOM
document.addEventListener("DOMContentLoaded", async () => {
    console.log("📜 DOM chargé, lancement du script...");

    // 1️⃣ Récupérer et afficher les films
    await displayMoviesInSwiper();

    // 2️⃣ Appliquer les styles aux boutons Swiper
    const prevButton = document.querySelector(".swiper-button-prev");
    const nextButton = document.querySelector(".swiper-button-next");

    if (prevButton && nextButton) {
        console.log("🎨 Personnalisation des boutons Swiper...");
        prevButton.style.fontWeight = "bolder";
        prevButton.style.color = "rgba(255, 149, 0, 1)";

        nextButton.style.fontWeight = "bolder";
        nextButton.style.color = "rgba(255, 149, 0, 1)";
    }

    console.log("✅ Script terminé !");
});
