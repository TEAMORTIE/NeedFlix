const toggleBtn = document.getElementById("themeToggle");

function setTheme(theme) {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("theme") || "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
}

// État initial
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

toggleBtn.addEventListener("click", toggleTheme);