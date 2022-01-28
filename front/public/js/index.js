const axios = require("axios");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(e.target.value);
  const params = {};
  params.Pays = e.target.Pays.value;
  params.Ville = e.target.Ville.value;
  params.CP = e.target.CP.value;
  params.RayonRecherche = e.target.RayonRecherche.value;
  params.NombreResultats = e.target.NombreResultats.value;

  let rep = {};
  if (params.Ville === "" && params.CP !== "") {
    rep = await axios
      .get(
        `http://localhost:3000/api/search/${params.Pays}/cp/${params.CP}?rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
      )
      .catch((error) => {
        console.log(error.message);
        document.querySelector("#relays").innerHTML = `${error.message}`;
      });
  } else if (params.Ville !== "" && params.CP === "") {
    rep = await axios
      .get(
        `http://localhost:3000/api/search/${params.Pays}/ville/${params.Ville}?rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
      )
      .catch((error) => {
        console.log(error.message);
        document.querySelector("#relays").innerHTML = `${error.message}`;
      });
  } else {
    rep = await axios
      .get(
        `http://localhost:3000/api/search/${params.Pays}/ville/${params.Ville}?cp=${params.CP}&rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
      )
      .catch((error) => {
        console.log(error.toJSON());
        document.querySelector("#relays").innerHTML = `${error.message}`;
      });
  }
  if (!rep) {
    return;
  }
  const { data } = rep;
  console.log(rep);
  document.querySelector("#relays").innerHTML = ``;
  data.forEach((pointRelais) => {
    document.querySelector("#relays").innerHTML += `
    <ul id="relay">
    <li>Number of the relay point : ${pointRelais.Num}</li>
    <li>Latitude : ${pointRelais.Latitude}</li>
    <li>Longitude : ${pointRelais.Longitude}</li>
    <li>Adress : ${pointRelais.Adresse}</li>
    <li>Distance : ${pointRelais.Distance}</li>
    <li>
    <ul>
    <li>Schedule :</li>
    `;
    const days = Object.keys(pointRelais.Horaires);
    days.forEach((day) => {
      let schedule = "";
      pointRelais.Horaires[day].forEach((hour, i) => {
        if (i === 1 || i === 3) {
          schedule += `- ${hour}`;
        } else {
          schedule += `${hour} `;
        }
      });
      document.querySelector("#relays").innerHTML += `
      <li>${day} : ${schedule}</li>
      `;
    });
    document.querySelector("#relays").innerHTML += `
    </ul>
    </li>
    <li><iframe src="${pointRelais.URL_Plan}"></li>
      </ul>
      `;
  });
});
