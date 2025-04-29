document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector(".burger-menu");
    const navLinks = document.querySelector(".nav-links");

    burger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        burger.classList.toggle("active"); // 🔄 Rotation du bouton burger
    });

    // Fermer le menu si on clique ailleurs
    document.addEventListener("click", (event) => {
        if (!navLinks.contains(event.target) && !burger.contains(event.target)) {
            navLinks.classList.remove("active");
            burger.classList.remove("active");
        }
    });
});
