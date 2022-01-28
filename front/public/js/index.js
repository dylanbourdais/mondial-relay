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

  document.querySelector("#relays").innerHTML = ``;
  data.forEach((pointRelais) => {
    const days = Object.keys(pointRelais.Horaires);
    let scheduling = "";

    days.forEach((day) => {
      let schedule = "";
      pointRelais.Horaires[day].forEach((hour, i) => {
        if (i === 1 || i === 3) {
          schedule += `- ${hour} `;
        } else {
          schedule += `${hour} `;
        }
      });
      scheduling += `
      <p>${day} : ${schedule}</p>
      `;
    });

    document.querySelector("#relays").innerHTML += `
    <section id="relay">
      <p>Number of the relay point : ${pointRelais.Num}</p>
      <p>Latitude : ${pointRelais.Latitude}</p>
      <p>Longitude : ${pointRelais.Longitude}</p>
      <p>Adress : ${pointRelais.Adresse}</p>
      <p>Distance : ${pointRelais.Distance}m</p>
      <p><img src=${pointRelais.URL_Photo} alt="picture not available"></p>
      <p>Schedule :</p>
      <div>
        ${scheduling}
      </div>
      <iframe src="${pointRelais.URL_Plan}">
    </section>
    `;
  });
});
