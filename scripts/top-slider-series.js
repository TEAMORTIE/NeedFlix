const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488"; // ⚠️ Clé à sécuriser côté backend !
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"; // URL des affiches des séries

/**
 * 🔄 Fonction pour récupérer les séries populaires depuis TMDB.
 * @returns {Promise<Array>}
 */
async function fetchPopularSeries() {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR&page=1`
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    return data.results ? data.results.slice(0, 10) : [];
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des séries :", error);
    return [];
  }
}

/**
 * 🔄 Fonction pour récupérer la bande-annonce d'une série depuis TMDB.
 * @param {number} seriesId - L'ID de la série.
 * @returns {Promise<string>} - L'URL de la bande-annonce.
 */
async function fetchSeriesTrailer(seriesId) {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${seriesId}/videos?api_key=${API_KEY}&language=fr-FR`
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const trailer = data.results.find((video) => video.type === "Trailer"); // Cherche une vidéo de type "Trailer"

    if (trailer) {
      return `https://www.youtube.com/watch?v=${trailer.key}`; // Lien vers la bande-annonce sur YouTube
    } else {
      return "#"; // Si aucune bande-annonce n'est trouvée
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération de la bande-annonce :",
      error
    );
    return "#"; // Lien par défaut si une erreur se produit
  }
}

/**
 * 🎬 Affiche les séries récupérées dans le Swiper.
 */
async function displaySeriesInSwiper() {
  const popularSeries = await fetchPopularSeries();
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  if (!swiperWrapper) {
    console.error("❌ Élément .swiper-wrapper introuvable !");
    return;
  }

  swiperWrapper.innerHTML = ""; // Nettoyage du slider

  if (popularSeries.length === 0) {
    console.warn("⚠️ Aucune série trouvée.");
    swiperWrapper.innerHTML = `<p class="error-message">Aucune série trouvée. 😢</p>`;
    return;
  }

  for (const series of popularSeries) {
    const imageUrl = series.backdrop_path
      ? `${IMAGE_BASE_URL}${series.backdrop_path}`
      : "images/placeholder.jpg";
    const description = series.overview
      ? series.overview.slice(0, 500) + "..."
      : "Aucune description disponible.";
    const trailerUrl = await fetchSeriesTrailer(series.id);

    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    slide.innerHTML = `
      <a onclick="window.location.href='serie-info.html?id=${series.id}'">
        <img class="fond" src="${imageUrl}" alt="${series.name}">
        <div class="movie-image">
          <img src="${IMAGE_BASE_URL + series.poster_path}" alt="${
      series.name
    }">
        </div>
        <div class="movie-title">${series.name}</div>
        <div class="movie-description">${description}</div>
        <a class="BO-button" href="${trailerUrl}" target="_blank">
          <i class="fa-solid fa-play" style="color: black"></i><p>Bande-Annonce</p>
        </a>
      </a>
    `;

    swiperWrapper.appendChild(slide);
  }

  setTimeout(() => {
    new Swiper(".swiper-big-series", {
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
      slidesPerView: 1,
      spaceBetween: 10,
    });
  }, 100);
}

displaySeriesInSwiper(); // Affiche les séries dans le Swiper
