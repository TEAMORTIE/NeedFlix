const API_KEY = "85a66825bd1a4015709c7f5b4a5cd488";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// récupérer l'ID de la série dans l'URL
const urlParams = new URLSearchParams(window.location.search);
const serieId = urlParams.get("id");
if (serieId) {
  afficherSerie(serieId);
} else {
  alert("Aucune série sélectionnée");
}

async function afficherSerie(serieId) {
  try {
    // Infos de la série
    const responseSerie = await fetch(
      `${BASE_URL}/tv/${serieId}?api_key=${API_KEY}&language=fr-FR`
    );
    const serie = await responseSerie.json();

    // Casting
    const responseCredits = await fetch(
      `${BASE_URL}/tv/${serieId}/credits?api_key=${API_KEY}&language=fr-FR`
    );
    const credits = await responseCredits.json();

    // Nettoyage
    const main = document.querySelector("main");
    if (main) main.remove();

    const newMain = document.createElement("main");
    newMain.classList.add("main");

    const date = new Date(serie.first_air_date);
    const formattedDate = date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let etoile = serie.vote_average / 2;
    let etoileHTML = "";

    for (let i = 1; i <= 5; i++) {
      etoileHTML +=
        i <= Math.round(etoile)
          ? `<i class="fa-solid fa-star"></i>`
          : `<i class="fa-regular fa-star"></i>`;
    }

    newMain.innerHTML = `
  <div class="retour">
    <i onclick="window.history.back()" class="fa-solid fa-arrow-left"></i>
  </div>

  <div class="main1">
    <img class="image_actor" src="${IMAGE_BASE_URL}${serie.poster_path}" alt="${
      serie.name
    }">
    <div class="infoactor">
      <div class="intro">
        <div class="etoile_div">
          <h2 class="nameactor">${serie.name}</h2>
          <div class="etoile">${etoileHTML}</div>
        </div>
        <p>Première diffusion : ${formattedDate} • ${
      serie.number_of_seasons
    } saison(s)</p>
      </div>
      <p class="synopsis">Synopsis</p>
      <p class="bio">${serie.overview || "Aucun synopsis disponible."}</p>
      <div class="btntrailerdiv">
        <button type="button" class="btntrailer" style="cursor: pointer;" onclick="trailer()">
          <i class="fa-regular fa-circle-play"></i> Bande-annonce
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
                <img  style='cursor:pointer;' onclick="window.location.href='acteurinfo.html?id=${
                  actor.id
                }'" src="${
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
    console.error("Erreur lors du chargement de la série :", error);
  }
}

async function trailer() {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${serieId}/videos?api_key=${API_KEY}&language=fr-FR`
    );
    const data = await response.json();

    const trailer = data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    if (trailer) {
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

      document.body.insertAdjacentHTML("beforeend", modalHTML);
    } else {
      alert("Trailer non disponible pour cette série.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du trailer :", error);
  }
}

function closeTrailer() {
  const modalOverlay = document.querySelector(".modal-overlay");
  if (modalOverlay) modalOverlay.remove();
}

function needlist() {
  let list = JSON.parse(localStorage.getItem("needlist")) || [];

  if (list.some((item) => item.id === serieId)) {
    showNotification("Série supprimée de votre liste!");
    list = list.filter((item) => item.id !== serieId);
    localStorage.setItem("needlist", JSON.stringify(list));
    return;
  }

  list.push({ id: serieId });
  localStorage.setItem("needlist", JSON.stringify(list));
  showNotification("Série ajoutée à votre liste!");
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `<i class="fa-solid fa-heart"></i>` + message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.top = 0 + "%";
  }, 10);

  setTimeout(() => {
    notification.style.top = -10 + "%";
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}
