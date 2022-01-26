const axios = require("axios");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const params = {};
  params.Pays = e.target.Pays.value;
  params.Ville = e.target.Ville.value;
  params.CP = e.target.CP.value;
  params.RayonRecherche = e.target.RayonRecherche.value;
  params.NombreResultats = e.target.NombreResultats.value;

  let rep = {};
  if (params.Ville === "" && params.CP !== "") {
    rep = await axios.get(
      `http://localhost:3000/api/search/${params.Pays}/cp/${params.CP}?rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
    );
  } else if (params.Ville !== "" && params.CP === "") {
    rep = await axios.get(
      `http://localhost:3000/api/search/${params.Pays}/ville/${params.Ville}?rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
    );
  } else {
    rep = await axios.get(
      `http://localhost:3000/api/search/${params.Pays}/ville/${params.Ville}?cp=${params.CP}&rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
    );
  }
  const { data } = rep;
  console.log(data);
  document.querySelector("#relays").innerHTML = ``;
  data.forEach((pointRelais) => {
    document.querySelector("#relays").innerHTML += `
    <ul>
    <li>Number of the relay point : ${pointRelais.Num}</li>
    <li>Latitude : ${pointRelais.Latitude}</li>
    <li>Longitude : ${pointRelais.Longitude}</li>
    <li>Adress : ${pointRelais.Adresse}</li>
    <li>Distance : ${pointRelais.Distance}</li>
    <li><iframe src="${pointRelais.URL_Plan}"></li>
    </ul>
    `;
  });
});
