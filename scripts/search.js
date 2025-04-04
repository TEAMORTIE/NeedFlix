// Ton JS
const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // meilleure taille pour affichage web

const searchInput = document.getElementById("search");
const resultsContainer = document.getElementById("results");

// Détecte la frappe ou la touche "Entrée"
searchInput.addEventListener("keyup", async (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      const results = await searchMovies(query);
      displayResults(results);
    }
  }
});

// Fonction pour appeler l'API
async function searchMovies(query) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&language=fr-FR`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    return [];
  }
}

// Fonction pour afficher les résultats
function displayResults(movies) {
  resultsContainer.innerHTML = "";

  if (movies.length === 0) {
    resultsContainer.innerHTML = "<p>Aucun film trouvé.</p>";
    return;
  }

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    console.log(movie);
    movieElement.classList.add("movie");
    const movieImage = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "https://placehold.co/400";
    movieElement.innerHTML = `
      <img src="${movieImage}" alt="${movie.title}" onclick="window.location.href='film.html?id=${movie.id}'" style="cursor: pointer;"/>
      <div class="movie-info"  >
      <h3>${movie.title}</h3>
      <div class="movie-rating">
    <p>${movie.release_date}</p>
        <span>${movie.vote_average}</span>
      </div> </div>
    `;

    resultsContainer.appendChild(movieElement);
  });
}
