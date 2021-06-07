let myobj = document.getElementById("alert");

document.querySelector(".btn-close").addEventListener("click", () => {
  document.querySelector("#alert").remove();
});
