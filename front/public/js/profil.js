const verifyUser = require("./modules/verifyUser");

verifyUser();

const signOut = document.querySelector("#signOut");

signOut.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("emailUser");
  document.location.href = "http://localhost:1234/login.html";
});
