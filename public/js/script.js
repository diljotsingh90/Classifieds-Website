const toggleButton = document.getElementById("menu-toggle");
const sideBar = document.getElementById("side-bar");
/* const body = document.querySelector("body"); */
toggleButton.addEventListener("click", () => {
  sideBar.classList.toggle("show");
  /* body.classList.toggle("show"); */
});
