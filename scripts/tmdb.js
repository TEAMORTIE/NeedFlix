// Clé API à protéger en backend en prod !
const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

async function fetchMovies(category, limit = 10) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();
    return data.results.slice(0, limit);
  } catch (error) {
    console.error(`❌ Erreur de récupération (${category}) :`, error);
    return [];
  }
}

async function fetchMovieTrailer(movieId) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=fr-FR`
    );
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();
    const trailer = data.results.find((video) => video.type === "Trailer");
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "#";
  } catch (error) {
    console.error("❌ Erreur de trailer :", error);
    return "#";
  }
}

async function displayMainPopularMovies() {
  const movies = await fetchMovies("popular", 7);
  const swiperWrapper = document.querySelector(".swiper-big .swiper-wrapper");
  if (!swiperWrapper) return;
  swiperWrapper.innerHTML = "";

  for (const movie of movies) {
    const imageUrl = movie.backdrop_path
      ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
      : "images/placeholder.jpg";
    const description = movie.overview
      ? movie.overview.slice(0, 500) + "..."
      : "Aucune description disponible.";
    const trailerUrl = await fetchMovieTrailer(movie.id);

    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");
    slide.innerHTML = `
      <a onclick="window.location.href='film.html?id=${movie.id}'">
        <img class="fond" src="${imageUrl}" alt="${movie.title}">
        <div class="movie-image">
          <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}">
        </div>
        <div class="movie-title">${movie.title}</div>
        <div class="movie-description">${description}</div>
        <a class="BO-button" href="${trailerUrl}" target="_blank">
          <i class="fa-solid fa-play" style="color: black"></i><p>Bande-Annonce</p>
        </a>
      </a>`;
    swiperWrapper.appendChild(slide);
  }

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
    slidesPerView: 1,
    spaceBetween: 10,
  });
}

async function createMovieSlider(category, swiperClass, limit = 10) {
  const movies = await fetchMovies(category, limit);
  const swiperWrapper = document.querySelector(
    `${swiperClass} .swiper-wrapper`
  );
  if (!swiperWrapper) return;
  swiperWrapper.innerHTML = "";

  for (const movie of movies) {
    const imageUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "images/placeholder.jpg";
    const title = movie.title || "Titre inconnu";
    const releaseDate = movie.release_date || "Date inconnue";
    const rating = movie.vote_average
      ? `${movie.vote_average.toFixed(1)}/10`
      : "Pas de note";
    const valeur =
      movie.vote_average >= 7
        ? "highrated"
        : movie.vote_average >= 5
        ? "mediumrated"
        : "lowrated";

    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");
    slide.innerHTML = `
      <img onclick="window.location.href='film.html?id=${movie.id}'" src="${imageUrl}" alt="${title}">
      <div onclick="window.location.href='film.html?id=${movie.id}'" class="movie-info">
        <div class="left-info-popular">
          <p class="movie-title-now">${title}</p>
          <p class="movie-date">${releaseDate}</p>
        </div>
        <div class="right-info">
          <p class="movie-rating ${valeur}">${rating}</p>
        </div>
      </div>
    `;
    swiperWrapper.appendChild(slide);
  }

  new Swiper(swiperClass, {
    loop: true,
    slidesPerView: 2,
    spaceBetween: 1,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 800,
    navigation: {
      nextEl: `${swiperClass} .swiper-button-next`,
      prevEl: `${swiperClass} .swiper-button-prev`,
    },
    breakpoints: {
      1024: { slidesPerView: 5 },
      768: { slidesPerView: 3 },
    },
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await displayMainPopularMovies();
  await createMovieSlider("now_playing", ".swiper-now-playing");
  await createMovieSlider("top_rated", ".swiper-top-rated");
  await createMovieSlider("popular", ".swiper-popular");
  await createMovieSlider("upcoming", ".swiper-upcoming");
});
