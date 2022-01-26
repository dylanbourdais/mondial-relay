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
  console.log(params.Ville);
  if (params.Ville === "" && params.CP !== "") {
    const rep = await axios.get(
      `http://localhost:3000/api/search/${params.Pays}/cp/${params.CP}?rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
    );
    console.log(rep);
  } else if (params.Ville !== "" && params.CP === "") {
    const rep = await axios.get(
      `http://localhost:3000/api/search/${params.Pays}/ville/${params.Ville}?rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
    );
    console.log(rep);
  }
});
