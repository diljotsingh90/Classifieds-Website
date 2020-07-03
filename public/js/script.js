const toggleButton = document.getElementById("menu-toggle");
const sideBar = document.getElementById("side-bar");
toggleButton.addEventListener("click", () => {
  sideBar.classList.toggle("show");
});
