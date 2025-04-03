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
            <img onclick="afficheracteur(${actor.id})" src="${actorImage}" alt="${actor.name}">
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

async function afficheracteur(actorId) {
  try {
    // Récupérer les informations de l'acteur
    const responseActor = await fetch(
      `${BASE_URL}/person/${actorId}?api_key=${API_KEY}&language=fr-FR`
    );
    const actorinfo = await responseActor.json();

    // Récupérer les films de l'acteur
    const responseMovies = await fetch(
      `${BASE_URL}/person/${actorId}/movie_credits?api_key=${API_KEY}&language=fr-FR`
    );
    const moviesData = await responseMovies.json();

    console.log("actor info:", actorinfo);
    console.log("movies info:", moviesData);

    // Vérification de l'existence de l'élément 'main' et suppression
    const main = document.querySelector("main");
    if (main) main.remove();

    // Création du nouvel élément 'main'
    const newMain = document.createElement("main");
    newMain.classList.add("main");
    newMain.innerHTML = `
      <div  class="retour">
      <i   onclick="window.location.reload()" class="fa-solid fa-arrow-left"></i></div>
      <div class="main1">
        <img class="image_actor" src="${IMAGE_BASE_URL}${
      actorinfo.profile_path
    }" alt="${actorinfo.name}">
        <div class="infoactor">
          <h2 class="nameactor">${actorinfo.name}</h2>
          <p class="bio">${
            actorinfo.biography || "Aucune biographie disponible."
          }</p>
          <p class="connu">Connu en tant que : ${
            actorinfo.known_for_department || "Inconnu"
          }</p>
        </div>
      </div>

      <div class="perso">
        <div class="infoperso">
          <h3 class="infoh3">Information Personnelles</h3>
          <p style="margin-top:20px;">Date de naissance : <br><br> <span>${
            actorinfo.birthday || "Inconnu"
          }</span></p>
          <p>Nationalité : <br> <br> <span>${
            actorinfo.place_of_birth || "Inconnue"
          }</span></p>
          <p>Genre : <br><br> <span>${
            actorinfo.gender === 2 ? "Homme" : "Femme"
          }</span></p>
          <p>Lieu de naissance : <br><br> <span>${
            actorinfo.place_of_birth || "Inconnu"
          }</span></p>
          <p>Alias : <br><br> 
            <span class="alias">
              ${
                actorinfo.also_known_as && actorinfo.also_known_as.length > 0
                  ? actorinfo.also_known_as.join(", ")
                  : "Aucun alias disponible"
              }
            </span>
          </p>

        </div>
        <div class="film">
          <p class="celebre"><strong >Célèbre pour :</strong></p>
          <div class="filmdiv">
            ${
              moviesData.cast && moviesData.cast.length > 0
                ? moviesData.cast
                    .slice(0)
                    .map((movie) => {
                      // Vérification si 'poster_path' existe pour éviter une image vide
                      const posterUrl = movie.poster_path
                        ? `${IMAGE_BASE_URL}${movie.poster_path}`
                        : "https://placehold.co/400"; // Image par défaut si pas de poster

                      return `
                      <div class="film2">
                        <img src="${posterUrl}" alt="${movie.title}" >
                        <p>${movie.title}</p>
                      </div>
                    `;
                    })
                    .join("")
                : "<li>Aucun film connu disponible.</li>"
            }
          </div>
      </div>
      </div>
    `;
    // Ajouter le nouvel élément 'main' au body
    document.body.appendChild(newMain);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'acteur ou de ses films :",
      error
    );
  }
}
