async function fetchMovies(category, limit = 10) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    return data.results ? data.results.slice(0, limit) : [];
  } catch (error) {
    console.error(
      `❌ Erreur lors de la récupération des films (${category}) :`,
      error
    );
    return [];
  }
}
let valeur;

async function createMovieSlider(category, swiperSelector) {
  const movies = await fetchMovies(category, 10);
  const swiperWrapper = document.querySelector(
    `${swiperSelector} .swiper-wrapper`
  );

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
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    const imageUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "images/placeholder.jpg";
    const title = movie.title || "Titre inconnu";
    const releaseDate = movie.release_date
      ? ` ${movie.release_date}`
      : "Date inconnue";
    const rating = movie.vote_average
      ? ` ${movie.vote_average.toFixed(1)}/10`
      : "Pas de note";
    const ratingPercent = movie.vote_average;

    if (ratingPercent >= 7) {
      valeur = "highrated";
    } else if (ratingPercent >= 5) {
      valeur = "mediumrated";
    } else {
      valeur = "lowrated";
    }
    slide.innerHTML = `
            <img onclick="window.location.href='film.html?id=${movie.id}'" src="${imageUrl}" alt="${title}">
            <div onclick="window.location.href='film.html?id=${movie.id}'" class="movie-info">
                <div class="left-info">
                    <p class="movie-title-now">${title}</p>
                    <p class="movie-date">${releaseDate}</p>
                </div>
                <div class="right-info">
                    <p class="movie-rating ${valeur}">${rating}</p>
                </div>
            </div>
        `;

    swiperWrapper.appendChild(slide);
  });

  // Initialisation du Swiper après injection
  new Swiper(swiperSelector, {
    loop: true,
    loopFillGroupWithBlank: true, // ✅ Remplit les espaces vides pour éviter les bugs
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
      1024: { slidesPerView: 5 },
      768: { slidesPerView: 3 },
    },
  });
}

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
  if (window.innerWidth < 768) {
    if (prevButton) prevButton.style.display = "none";
    if (nextButton) nextButton.style.display = "none";
  } else {
    if (prevButton) prevButton.style.display = "block";
    if (nextButton) nextButton.style.display = "block";
  }

  createMovieSlider("now_playing", ".swiper-now-playing");
});
