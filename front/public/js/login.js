const axios = require("axios");

if (localStorage.getItem("token")) {
  document.location.href = "http://localhost:1234/profil.html";
}

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const params = {};
  params.email = e.target.mail.value;
  params.password = e.target.pass.value;

  // on construit et on envoie la requête de connexion
  const options = {
    method: "post",
    url: "http://localhost:3000/login",
    data: params,
  };

  let rep = 0;
  try {
    rep = await axios(options);
  } catch (err) {
    document.querySelector("span").textContent = err.message;
  }
  // si la requête de connexion réussi
  if (rep.status === 200) {
    // on enregistre le token et l'email de l'utilisateur dans localStorage
    localStorage.setItem("token", rep.data.token);
    localStorage.setItem("emailUser", rep.data.emailUser);

    // on va sur la page "profil.html"
    document.location.href = `http://localhost:1234/profil.html`;
  }
});
