const axios = require("axios");
const verifyUser = require("./modules/verifyUser");

verifyUser();

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // on récupère les informations du formulaire
  params = {};
  params.street = e.target.address.value;
  params.compl = e.target.address2.value;
  params.zip = e.target.zip.value;
  params.city = e.target.City.value;

  // on construit et on envoie la requête
  const options = {
    method: "post",
    url: "http://localhost:3000/user/updateAddress",
    data: { email: localStorage.getItem("emailUser"), address: params },
  };
  try {
    const { data } = await axios(options);
    document.querySelector("#message").textContent = data;
  } catch (err) {
    document.querySelector("#message").textContent = err.message;
  }
});
