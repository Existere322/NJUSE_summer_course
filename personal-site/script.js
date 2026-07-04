(function () {
  var STORAGE_KEY = "theme";
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  if (toggle) {
    toggle.addEventListener("click", toggleTheme);
  }
})();
