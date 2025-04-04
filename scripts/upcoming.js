
async function createUpcomingMovieSlider() {
    const category = "upcoming"; // Catégorie TMDB
    const swiperSelector = ".swiper-upcoming"; // Sélecteur du slider

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

    movies.forEach((movie) => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        const imageUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "images/placeholder.jpg";
        const title = movie.title || "Titre inconnu";
        const releaseDate = movie.release_date ? ` ${movie.release_date}` : "Date inconnue";
        const rating = movie.vote_average ? ` ${movie.vote_average.toFixed(1)}/10` : "Pas de note";

        slide.innerHTML = `
            <img src="${imageUrl}" alt="${title}">
            <div class="movie-info">
                <div class="left-info-upcoming">
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

    // Initialisation du Swiper pour les films populaires
    new Swiper(swiperSelector, {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 1,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            reverse: false,
        },
        speed: 800,
        navigation: {
            nextEl: `${swiperSelector} .swiper-button-next`,
            prevEl: `${swiperSelector} .swiper-button-prev`,
        },
        breakpoints: {
            1024: { slidesPerView: 5 },
            768: { slidesPerView: 1 },
        },
    });
}

// Exécuter la fonction après le chargement du DOM
document.addEventListener("DOMContentLoaded", async () => {
    // 1️⃣ Récupérer et afficher les films
    await createUpcomingMovieSlider();

    // 2️⃣ Appliquer les styles aux boutons Swiper
    const prevButton = document.querySelector(".swiper-button-prev-upcoming");
    const nextButton = document.querySelector(".swiper-button-next-upcoming");

    if (prevButton && nextButton) {
        prevButton.style.fontWeight = "bolder";
        prevButton.style.color = "rgba(255, 149, 0, 1)";

        nextButton.style.fontWeight = "bolder";
        nextButton.style.color = "rgba(255, 149, 0, 1)";
    }

    // Gestion de la visibilité des boutons en fonction de la taille de l'écran
    if (window.innerWidth < 768) {
        if (prevButton) prevButton.style.display = "none";
        if (nextButton) nextButton.style.display = "none";
    } else {
        if (prevButton) prevButton.style.display = "block";
        if (nextButton) nextButton.style.display = "block";
    }
});
