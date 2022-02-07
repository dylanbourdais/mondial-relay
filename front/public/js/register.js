const axios = require("axios");

const token = localStorage.getItem("token");
if (token) {
  document.location.href = "http://localhost:1234/profil.html";
}

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // on récupère les informations du formulaire
  const params = {
    email: [],
    pass: [],
  };
  params.firstName = e.target.firstName.value;
  params.lastName = e.target.lastName.value;
  params.email.push(e.target.mail.value);
  params.email.push(e.target.mailConfirm.value);
  params.pass.push(e.target.pass.value);
  params.pass.push(e.target.passConfirm.value);

  // on vérifie si les informations de email sont identiques et idem pour password
  if (params.email[0] !== params.email[1]) {
    return (document.querySelector("span").textContent = "email invalide");
  }
  if (params.pass[0] !== params.pass[1]) {
    return (document.querySelector("span").textContent = "password invalide");
  }

  // on construit et on envoie la requête
  const newUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email[0],
    password: params.pass[0],
  };
  const options = {
    method: "post",
    url: "http://localhost:3000/user/register/",
    headers: {
      "Content-Type": "application/json",
    },
    data: newUser,
  };

  try {
    const rep = await axios(options);

    // on enregistre le token et l'email de l'utilisateur dans localStorage
    localStorage.setItem("token", rep.data.token);
    localStorage.setItem("emailUser", rep.data.emailUser);

    // on va sur la page "profil.html"
    document.location.href = "profil.html";
  } catch (err) {
    document.querySelector("span").textContent = err.message;
  }
});
