const axios = require("axios");
const verifyUser = require("./modules/verifyUser");

verifyUser();

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // on récupère les informations du formulaire
  const params = {
    email: [],
    password: [],
  };
  params.firstName = e.target.firstName.value;
  params.lastName = e.target.lastName.value;
  params.email.push(e.target.mail.value);
  params.email.push(e.target.mailConfirm.value);
  params.password.push(e.target.pass.value);
  params.password.push(e.target.passConfirm.value);

  // on vérifie si les informations de email sont identiques et idem pour password
  if (params.email[0] !== params.email[1]) {
    return (document.querySelector("#message").textContent = "email invalide");
  }
  if (params.password[0] !== params.password[1]) {
    return (document.querySelector("#message").textContent =
      "password invalide");
  }

  // on supprime les doublons
  params.email.pop();
  params.email = params.email.toString();
  params.password.pop();
  params.password = params.password.toString();

  // on construit et on envoie la requête
  const options = {
    method: "post",
    url: "http://localhost:3000/user/updateProfil",
    data: { email: localStorage.getItem("emailUser"), user: params },
  };
  try {
    const rep = await axios(options);
    if (rep.data.email) {
      localStorage.setItem("emailUser", rep.data.email);
    }
  } catch (err) {
    document.querySelector("#message").textContent = err.message;
  }
});
