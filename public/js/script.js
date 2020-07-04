const toggleButton = document.getElementById("menu-toggle");
const sideBar = document.getElementById("side-bar");
const editButton = document.querySelector(".edit");
const deleteButton = document.querySelector(".delete");
const body = document.querySelector("body");
toggleButton.addEventListener("click", () => {
  sideBar.classList.toggle("show");
});

sideBar.addEventListener("click", (e) => {
  if (e.target.id === "side-bar") {
    sideBar.classList.toggle("show");
  }
});
