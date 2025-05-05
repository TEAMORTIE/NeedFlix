document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const url = link.getAttribute("href");

      // Charger la nouvelle page sans recharger toute l’application
      const response = await fetch(url);
      const html = await response.text();

      // Extraire le contenu du `<body>` pour éviter de dupliquer les scripts
      const newDocument = new DOMParser().parseFromString(html, "text/html");
      document.body.innerHTML = newDocument.body.innerHTML;

      // Mettre à jour l’URL sans recharger la page
      history.pushState({}, "", url);
    });
  });
});
