// URL de base pour l'API TMDB
const API_BASE_URL = "https://api.themoviedb.org/3";

// Fonction pour récupérer les séries depuis une catégorie
async function fetchMovies(category, limit = 10) {
  try {
    console.log(`Récupération des séries de la catégorie: ${category}`);
    const response = await fetch(
      `${API_BASE_URL}/${category}?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des séries: ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log(`Réponse de l'API:`, data); // Affiche la réponse complète pour déboguer
    return data.results.slice(0, limit); // Limite le nombre de séries
  } catch (error) {
    console.error("Erreur dans la récupération des séries:", error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

// Fonction pour créer le slider des séries top-rated
async function createTopRatedSerieslider() {
  const category = "tv/top_rated"; // Catégorie TMDB pour les séries top-rated
  const swiperSelector = ".swiper-top-rated-series"; // Sélecteur du slider

  // Récupérer les séries avec la fonction fetchMovies
  const series = await fetchMovies(category, 10);
  console.log("Séries récupérées:", series);

  const swiperWrapper = document.querySelector(
    `${swiperSelector} .swiper-wrapper`
  );
  if (!swiperWrapper) {
    console.error(`❌ Élément ${swiperSelector} introuvable !`);
    return;
  }

  swiperWrapper.innerHTML = ""; // Nettoyage avant ajout

  if (series.length === 0) {
    console.warn(`⚠️ Aucune série trouvée pour "${category}".`);
    swiperWrapper.innerHTML = `<p class="error-message">Aucune série trouvée. 😢</p>`;
    return;
  }

  series.forEach((serie) => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    const imageUrl = serie.poster_path
      ? `${IMAGE_BASE_URL}${serie.poster_path}`
      : "images/placeholder.jpg";
    const title = serie.name || "Titre inconnu"; // Utilisation de `name` pour les séries
    const releaseDate = serie.first_air_date
      ? ` ${serie.first_air_date}`
      : "Date inconnue"; // Date de première diffusion
    const rating = serie.vote_average
      ? ` ${serie.vote_average.toFixed(1)}/10`
      : "Pas de note";

    const ratingPercent = serie.vote_average;

    const valeur =
      ratingPercent >= 7
        ? "highrated"
        : ratingPercent >= 5
        ? "mediumrated"
        : "lowrated";

    slide.innerHTML = `
            <img onclick="window.location.href='serie-info.html?id=${serie.id}'" src="${imageUrl}" alt="${title}">
            <div onclick="window.location.href='serie-info.html?id=${serie.id}'" class="serie-info">
                <div class="left-info-rated">
                    <p class="serie-title">${title}</p>
                    <p class="serie-date">${releaseDate}</p>
                </div>
                <div class="right-info">
                    <p class="serie-rating ${valeur}">${rating}</p>
                </div>
            </div>
        `;

    swiperWrapper.appendChild(slide);
  });

  // Initialisation du Swiper pour les séries mieux notées
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
      768: { slidesPerView: 3 },
    },
  });
}

// Exécuter la fonction après le chargement du DOM
document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Récupérer et afficher les séries
  await createTopRatedSerieslider();

  // 2️⃣ Appliquer les styles aux boutons Swiper
  const prevButton = document.querySelector(
    ".swiper-button-prev-top-rated-series"
  );
  const nextButton = document.querySelector(
    ".swiper-button-next-top-rated-series"
  );

  if (prevButton && nextButton) {
    prevButton.style.fontWeight = "bolder";
    prevButton.style.color = "rgba(255, 149, 0, 1)";

    nextButton.style.fontWeight = "bolder";
    nextButton.style.color = "rgba(255, 149, 0, 1)";
  }

  if (window.innerWidth < 768) {
    if (prevButton) prevButton.style.display = "none";
    if (nextButton) nextButton.style.display = "none";
  } else {
    if (prevButton) prevButton.style.display = "block";
    if (nextButton) nextButton.style.display = "block";
  }
});
