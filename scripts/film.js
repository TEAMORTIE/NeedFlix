// Ton JS
const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// recuperer movie id dans l"url
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");
if (movieId) {
  afficherFilm(movieId);
} else {
  alert("Aucun film sélectionné");
}
async function afficherFilm(movieId) {
  try {
    // Récupération des infos du film
    const responseFilm = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`
    );
    const film = await responseFilm.json();

    // Récupération du casting
    const responseCredits = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`
    );
    const credits = await responseCredits.json();

    // Récupération des vidéos (bande-annonces)

    // Nettoyage de la page
    const main = document.querySelector("main");
    if (main) main.remove();

    // Création d’un nouveau main
    const newMain = document.createElement("main");
    newMain.classList.add("main");
    const date = new Date(film.release_date);
    const formattedDate = date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const runtime = film.runtime; // exemple : 135
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    const formattedRuntime = `${hours}h ${minutes}min`;
    let etoile = film.vote_average / 2; // Note sur 5
    let etoileHTML = "";

    for (let i = 1; i <= 5; i++) {
      etoileHTML +=
        i <= Math.round(etoile)
          ? `<i class="fa-solid fa-star"></i>` // étoile pleine
          : `<i class="fa-regular fa-star"></i>`; // étoile vide
    }

    newMain.innerHTML = `
  <div class="retour">
    <i onclick="window.history.back()" class="fa-solid fa-arrow-left"></i>
  </div>

  <div class="main1">
    <img class="image_actor" src="${IMAGE_BASE_URL}${film.poster_path}" alt="${
      film.title
    }">
    <div class="infoactor">
      <div class="intro">
        <div class="etoile_div">
          <h2 class="nameactor">${film.title}</h2>
          <div class="etoile">
            ${etoileHTML}
          </div>
        </div>
        <p>Date de sortie : ${formattedDate} • ${formattedRuntime}</p>
      </div>
      <p class="synopsis">Synopsis</p>
      <p class="bio">${film.overview || "Aucun synopsis disponible."}</p>
      <div class="btntrailerdiv">
    <button type="button" class="btntrailer" style="cursor: pointer;" onclick="trailer()" >
      <i class="fa-regular fa-circle-play"  ></i>

     Bande-annonce
    </button>
    <i class="fa-regular fa-heart coeur" onclick="needlist()"></i>
    
    </div>
    </div>
  </div>

  <div class="perso">
    <div class="film">
      <h3 class="infoh3">Casting</h3>
      <div class="filmdiv">
        ${credits.cast
          .map(
            (actor) => `
              <div class="film2">
                <img src="${
                  actor.profile_path
                    ? IMAGE_BASE_URL + actor.profile_path
                    : "https://placehold.co/200x300"
                }" alt="${actor.name}">
                <p>${actor.name}</p>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  </div>
`;

    document.body.appendChild(newMain);
  } catch (error) {
    console.error("Erreur lors du chargement du film :", error);
  }
}
async function trailer() {
  try {
    // Récupérer les informations sur le film (par exemple, ici on utilise `film.id`)
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=fr-FR`
    );
    const data = await response.json();

    // Chercher le trailer
    const trailer = data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    if (trailer) {
      // Créer la popup avec la vidéo
      const trailerURL = `https://www.youtube.com/embed/${trailer.key}`;

      const modalHTML = `
        <div class="modal-overlay">
          <div class="modal-content">
            <iframe 
              width="800" 
              height="450" 
              src="${trailerURL}" 
              frameborder="0" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
            <button onclick="closeTrailer()" class="close-btn"><i class="fa-solid fa-x"></i></button>
          </div>
        </div>
      `;

      // Ajouter la popup à la page
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    } else {
      alert("Trailer non disponible pour ce film.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du trailer :", error);
  }
}

function closeTrailer() {
  // Fermer la fenêtre modale en supprimant l'overlay
  const modalOverlay = document.querySelector(".modal-overlay");
  if (modalOverlay) modalOverlay.remove();
}
function needlist() {
  let movie = movieId;
  let list = JSON.parse(localStorage.getItem("needlist")) || [];

  // Vérifier si le film est déjà dans la liste
  if (list.some((item) => item.id === movieId)) {
    showNotification("Ce film est déjà dans votre liste !");
    return;
  }
  // Ajouter le film à la liste
  list.push({ id: movieId });
  localStorage.setItem("needlist", JSON.stringify(list));
  showNotification("Film ajouté à votre liste!");
}

// Fonction pour afficher une notification simple
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `<i class="fa-solid fa-heart"></i>` + message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => notification.remove(), 300); // Retirer après l'animation de fondu
  }, 2000);
}
