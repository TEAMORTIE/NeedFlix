const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488"; // ⚠️ Clé à sécuriser côté backend !
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"; // URL des affiches de films


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

async function fetchMovieTrailer(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=fr-FR`);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const trailer = data.results.find(video => video.type === "Trailer"); // Cherche une vidéo de type "Trailer"

        if (trailer) {
            return `https://www.youtube.com/watch?v=${trailer.key}`; // Lien vers la bande-annonce sur YouTube
        } else {
            return "#"; // Si aucune bande-annonce n'est trouvée
        }
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la bande-annonce :", error);
        return "#"; // Lien par défaut si une erreur se produit
    }
}

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

    for (const movie of movies) {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        // Vérification si l'image existe
        const imageUrl = movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : "images/placeholder.jpg";
        const description = movie.overview ? movie.overview.slice(0, 100) + "..." : "Aucune description disponible.";

        // Récupérer l'URL de la bande-annonce pour chaque film
        const trailerUrl = await fetchMovieTrailer(movie.id);

        slide.innerHTML = `
            <img src="${imageUrl}" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-description">${description}</div>
            <a class="BO-button" href="${trailerUrl}" target="_blank">
                <i class="fa-solid fa-play" style="color: black"></i><p>Bande-Annonce</p>
            </a>
        `;

        swiperWrapper.appendChild(slide);
    }

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

