const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488"; // ⚠️ Clé à sécuriser côté backend !
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"; // URL des affiches de films

/**
 * 🔄 Fonction pour récupérer les films populaires depuis TMDB.
 * @returns {Promise<Array>} - Liste des films populaires (max 10).
 */
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

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

        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        // Vérification si l'image existe
        const imageUrl = movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : "images/placeholder.jpg";
        const description = movie.overview ? movie.overview.slice(0, 100) + "..." : "Aucune description disponible.";

        slide.innerHTML = `
            <img src="${imageUrl}" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-description">${description}</div>
            <a class="BO-button" href=""><i class="fa-solid fa-play" style="color: black"></i><p>Bande-Annonce</p></a>
        `;

        swiperWrapper.appendChild(slide);
    });


    // Initialiser Swiper après avoir ajouté les films
    setTimeout(() => {
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
            slidesPerView: 1, // ✅ Affiche uniquement une slide à la fois
            spaceBetween: 10, // ✅ Espacement entre les slides
        });
    }, 100);

}

// 🏁 Exécuter tout le script après le chargement du DOM
document.addEventListener("DOMContentLoaded", async () => {

    // 1️⃣ Récupérer et afficher les films
    await displayMoviesInSwiper();

    // 2️⃣ Appliquer les styles aux boutons Swiper
    const prevButton = document.querySelector(".swiper-button-prev-now");
    const nextButton = document.querySelector(".swiper-button-next-now");

    if (prevButton && nextButton) {
        prevButton.style.fontWeight = "bolder";
        prevButton.style.color = "rgba(255, 149, 0, 1)";

        nextButton.style.fontWeight = "bolder";
        nextButton.style.color = "rgba(255, 149, 0, 1)";
    }

});
