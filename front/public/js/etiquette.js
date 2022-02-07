const axios = require("axios");
const changeNavBar = require("./modules/navbar");
const verifyUser = require("./modules/verifyUser");

changeNavBar();

const prefill = async (form) => {
  try {
    const data = await verifyUser();
    form.Expe_Langage.value = "FR";
    form.Expe_Ad1.value = `${data.firstName} ${data.lastName}`;
    form.Expe_Ad3.value = data.address.street;
    form.Expe_Ville.value = data.address.city;
    form.Expe_CP.value = data.address.zip;
  } catch (err) {
    window.alert(err.message);
  }
};

const form = document.querySelector("form");

// si l'utilisateur est connecté à son compte, on préremplit les champs du formulaire
if (localStorage.getItem("token")) {
  prefill(form);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // on récupère les informations du formulaire
  params = {};
  params.ModeCol = e.target.ModeCol.value;
  params.ModeLiv = e.target.ModeLiv.value;
  params.Expe_Langage = e.target.Expe_Langage.value.toUpperCase();
  params.Expe_Ad1 = e.target.Expe_Ad1.value.toUpperCase();
  params.Expe_Ad3 = e.target.Expe_Ad3.value.toUpperCase();
  params.Expe_Ville = e.target.Expe_Ville.value.toUpperCase();
  params.Expe_CP = e.target.Expe_CP.value;
  params.Expe_Pays = e.target.Expe_Pays.value.toUpperCase();
  params.Expe_Tel1 = e.target.Expe_Tel1.value.toUpperCase();
  params.Dest_Langage = e.target.Dest_Langage.value.toUpperCase();
  params.Dest_Ad1 = e.target.Dest_Ad1.value.toUpperCase();
  params.Dest_Ad3 = e.target.Dest_Ad3.value.toUpperCase();
  params.Dest_Ville = e.target.Dest_Ville.value.toUpperCase();
  params.Dest_CP = e.target.Dest_CP.value;
  params.Dest_Pays = e.target.Dest_Pays.value.toUpperCase();
  params.Poids = e.target.Poids.value;
  params.NbColis = e.target.NbColis.value;
  params.CRT_Valeur = e.target.CRT_Valeur.value;
  params.COL_Rel_Pays = e.target.COL_Rel_Pays.value.toUpperCase();
  params.COL_Rel = e.target.COL_Rel.value.toUpperCase();
  params.LIV_Rel_Pays = e.target.LIV_Rel_Pays.value.toUpperCase();
  params.LIV_Rel = e.target.LIV_Rel.value;

  // on construit et on envoie une requête afin de créer une étiquette
  const options = {
    method: "post",
    url: "http://127.0.0.1:3000/api/createEtiquette/",
    headers: {
      "Content-Type": "application/json",
    },
    data: params,
  };

  let rep = "";
  let etiquette = {};
  try {
    rep = await axios(options);
    etiquette = {
      num: rep.data.ExpeditionNum,
      url: rep.data.URL_Etiquette,
      emailUser: localStorage.getItem("emailUser").replace(/"/g, ""),
    };
  } catch (err) {
    document.querySelector("span").textContent = err.message;
  }
  // on envoie une requête afin d'enregistrer une étiquette dans la base de données
  try {
    rep = await axios.post("http://127.0.0.1:3000/etiquette/save", {
      etiquette,
    });
    document.querySelector("span").innerHTML = `
        The etiquette was created.
        click
        <a href="${etiquette.url}">here</a>
        to download it
        `;
  } catch (err) {
    document.querySelector("span").textContent = err.message;
  }
});
