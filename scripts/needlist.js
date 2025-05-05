const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const movies = JSON.parse(localStorage.getItem("needlist")) || [];

const displayMovies = async () => {
  for (const movie of movies) {
    try {
      // Récupération des infos du film
      const response = await fetch(
        `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=fr-FR`
      );
      const data = await response.json();

      // Création de l'élément HTML
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie");
      movieElement.innerHTML = `
        <img src="${IMAGE_BASE_URL + data.poster_path}" alt="${
        data.title
      }"  onclick="window.location.href='film.html?id=${movie.id}'"  />
        <h2>${data.title}</h2>
            <i class="fa-solid fa-heart coeur"></i>

      `;
      document.getElementById("section_film").appendChild(movieElement);

      // Gestion du bouton Supprimer
      movieElement.querySelector(".coeur").addEventListener("click", () => {
        const updatedMovies = movies.filter((m) => m.id !== movie.id);
        localStorage.setItem("needlist", JSON.stringify(updatedMovies));
        movieElement.remove();
      });
    } catch (error) {
      console.error("Erreur lors de l'affichage du film :", error);
    }
  }
};

displayMovies();
