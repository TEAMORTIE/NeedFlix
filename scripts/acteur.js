const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

// Variables globales
let currentPage = 1; // Page actuelle
let isLoading = false; // Empêche de faire plusieurs requêtes en même temps
let main = document.getElementById("main");
// Fonction pour récupérer les acteurs populaires par page
async function fetchPopularActors(page = 1) {
  if (isLoading) return; // Empêche de faire plusieurs requêtes en même temps
  isLoading = true;

  try {
    const response = await fetch(
      `${BASE_URL}/person/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    const data = await response.json();

    // Appel à la fonction pour afficher les acteurs sur la page
    displayActors(data.results);

    // Si tous les acteurs ont été récupérés, on désactive le bouton
    if (page >= data.total_pages) {
      document.getElementById("next-button").disabled = true;
    } else {
      document.getElementById("next-button").disabled = false;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des acteurs populaires :",
      error
    );
  } finally {
    isLoading = false;
  }
}

// Fonction pour afficher les acteurs
function displayActors(actors) {
  const container = document.getElementById("actors-container");

  // Vider le conteneur à chaque changement de page pour remplacer les acteurs
  container.innerHTML = "";

  actors.forEach((actor) => {
    const actorElement = document.createElement("div");
    actorElement.classList.add("actor");

    const actorImage = actor.profile_path
      ? `${IMAGE_BASE_URL}${actor.profile_path}`
      : "https://placehold.co/400";
    actorElement.innerHTML = `
            <img onclick="window.location.href='acteurinfo.html?id=${actor.id}'" src="${actorImage}" alt="${actor.name}">
            <p class="actor-name">${actor.name}</p>
            <p>${actor.known_for_department}</p>
        `;

    container.appendChild(actorElement);
  });
}

// Fonction pour charger la page suivante
document.getElementById("next-button").addEventListener("click", () => {
  currentPage += 1;
  fetchPopularActors(currentPage);
  document.getElementById("page").innerHTML = currentPage;
});

document.getElementById("page").innerHTML = currentPage;
document.getElementById("precedent-button").addEventListener("click", () => {
  if (currentPage < 0) {
    currentPage = 0;
    document.getElementById("page").innerHTML = currentPage;
  } else if (currentPage > 1) {
    currentPage -= 1;
    document.getElementById("page").innerHTML = currentPage;
  }
  fetchPopularActors(currentPage);
});
// Initialisation : Charger les premiers acteurs
fetchPopularActors(currentPage);
