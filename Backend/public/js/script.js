let myobj = document.getElementById("alert");

document.querySelector(".btn-close").addEventListener("click", () => {
  document.querySelector("#alert").remove();
});

document.querySelector(".btn-delete").addEventListener("click", () => {
  console.log("button clicked");

  if (confirm("Press a button!"))
  {
  alert("You pressed OK!"); 
  href="/admin/users/{{this.id}}"
  } 
  else { alert("You pressed Cancel!"); } });
