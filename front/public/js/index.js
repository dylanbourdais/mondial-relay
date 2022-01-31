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
    let address = pointRelais.Adresse.split(",");
    let addEl = "";
    address.forEach((el) => {
      addEl += `
      <div id="address-content">
        <p>${el}</p>
      </div>
      `;
    });

    document.querySelector("#relays").innerHTML += `
    <section id="relay">
      <div class="relay">
        <img src=${pointRelais.URL_Photo} alt="picture not available">
      </div>
      <div class="relay">
        <p>no. ${pointRelais.Num}</p>
      </div>
      <div class="relay">
        <p>Latitude : ${pointRelais.Latitude}, Longitude : ${pointRelais.Longitude}</p>
      </div>
      <div class="relay" id="address">
        <p id="address-text">Address :</p>
        ${addEl}
      </div>
      <div class="relay">
        <p>Distance : ${pointRelais.Distance}m</p>
      </div>
      <div class="relay" id="schedule">
        <p id="schedule-text">Schedule :</p>
        ${scheduling}
      </div>
      <div class="relay" id="map">
        <iframe src="${pointRelais.URL_Plan}">
      </div>
    </section>
    `;
  });
});
