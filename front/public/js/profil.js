const axios = require("axios");
const verifyUser = require("./modules/verifyUser");

verifyUser();

const signOut = document.querySelector("#signOut");

signOut.addEventListener("click", (e) => {
  localStorage.removeItem("token");
  document.location.href = "http://localhost:1234/login.html";
});
