const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const urlParams = new URLSearchParams(window.location.search);

const actorIds = urlParams.get("id");

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
      <i   onclick="window.location.href='acteur.html'" class="fa-solid fa-arrow-left"></i></div>
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
                      <img style="cursor:pointer" onclick="window.location.href='film.html?id=${movie.id}'" src="${posterUrl}" alt="${movie.title}" >
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

afficheracteur(actorIds);
