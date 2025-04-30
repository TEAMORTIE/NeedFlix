async function createPopularSeriesSlider() {
    const category = "tv/popular"; // Catégorie TMDB pour séries populaires
    const swiperSelector = ".swiper-popular-series"; // Sélecteur du slider

    const series = await fetchMovies(category, 10);
    const swiperWrapper = document.querySelector(`${swiperSelector} .swiper-wrapper`);

    if (!swiperWrapper) {
        console.error(`❌ Élément ${swiperSelector} introuvable !`);
        return;
    }

    swiperWrapper.innerHTML = ""; // Nettoyage

    if (series.length === 0) {
        console.warn(`⚠️ Aucune série trouvée pour "${category}".`);
        swiperWrapper.innerHTML = `<p class="error-message">Aucune série trouvée. 😢</p>`;
        return;
    }

    let valeur;
    series.forEach((serie) => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        const imageUrl = serie.poster_path ? `${IMAGE_BASE_URL}${serie.poster_path}` : "images/placeholder.jpg";
        const title = serie.name || "Titre inconnu";
        const releaseDate = serie.first_air_date ? ` ${serie.first_air_date}` : "Date inconnue";
        const rating = serie.vote_average ? ` ${serie.vote_average.toFixed(1)}/10` : "Pas de note";
        const ratingPercent = serie.vote_average;

        if (ratingPercent >= 7) {
            valeur = "highrated";
        } else if (ratingPercent >= 5) {
            valeur = "mediumrated";
        } else {
            valeur = "lowrated";
        }

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

    // Initialisation du Swiper
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

// À appeler dans DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
    await createPopularSeriesSlider();

    const prevButton = document.querySelector(".swiper-button-prev-popular-series");
    const nextButton = document.querySelector(".swiper-button-next-popular-series");

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
