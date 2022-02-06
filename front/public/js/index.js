const axios = require("axios");
const changeNavBar = require("./modules/navbar");

changeNavBar();

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  document.querySelector("#relays").style.backgroundColor = "#eef0f3";

  // on récupère les informations du formulaire
  const params = {};
  params.Pays = e.target.Pays.value;
  params.Ville = e.target.Ville.value;
  params.CP = e.target.CP.value;
  params.RayonRecherche = e.target.RayonRecherche.value;
  params.NombreResultats = e.target.NombreResultats.value;

  let rep = {};

  // si le code postale est renseigner mais pas la ville
  if (params.Ville === "" && params.CP !== "") {
    rep = await axios
      .get(
        `http://localhost:3000/api/search/${params.Pays}/cp/${params.CP}?rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
      )
      .catch((error) => {
        document.querySelector("#relays").innerHTML = `${error.message}`;
        return;
      });
  }
  // sinon si la ville est renseigner mais pas le code postale
  else if (params.Ville !== "" && params.CP === "") {
    rep = await axios
      .get(
        `http://localhost:3000/api/search/${params.Pays}/ville/${params.Ville}?rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
      )
      .catch((error) => {
        document.querySelector("#relays").innerHTML = `${error.message}`;
        return;
      });
  } else {
    rep = await axios
      .get(
        `http://localhost:3000/api/search/${params.Pays}/ville/${params.Ville}?cp=${params.CP}&rayon=${params.RayonRecherche}&results=${params.NombreResultats}`
      )
      .catch((error) => {
        document.querySelector("#relays").innerHTML = `${error.message}`;
        return;
      });
  }

  const { data } = rep;

  const geojson = {
    type: "Relay",
    relays: [],
  };

  let listRelay = "";
  let detailRelay = [];
  let id = 0;

  document.querySelector("#relays").innerHTML = ``;

  data.forEach((pointRelais) => {
    // on récupère la rue et le CP/Ville qu'on place dans deux variables
    let street = pointRelais.Adresse.split(",");
    street.splice(4, 1);
    street.shift();
    const zipCity = street.splice(0, 2);

    // on créer le résumer du point relais
    listRelay += `
    <section class="relay-section" id=${id}>
      <div id="relay-head">
      <div id="relay-name">
      <p>${pointRelais.Adresse.split(",")[4]}
      </div>
      <div class="relay" id="relay-num">
        <p>no. ${pointRelais.Num}</p>
      </div>
      </div>
      <div id="relay-body">
      <div class="relay" id="address">
        <p>${zipCity.toString()}</p>
        <p>${street.toString()}</p>
      </div>
      <div class="relay">
        <p>Distance : ${pointRelais.Distance / 1000}km</p>
      </div>
      </div>
    </section>
    `;

    // on formatte l'affichage des horaires
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

    // on créer la fiche plus détailler du points relais
    detailRelay.push(`
    <section class="relay-section" id=${id}>
      <div id="relay-head">
      <div id="relay-name">
      <p>${pointRelais.Adresse.split(",")[4]}
      </div>
      <div class="relay" id="relay-num">
        <p>no. ${pointRelais.Num}</p>
      </div>
      </div>
      <div id="relay-body">
      <div class="relay" id="address">
        <p>${zipCity.toString()}</p>
        <p>${street.toString()}</p>
      </div>
      <div class="relay">
        <p>Distance : ${pointRelais.Distance / 1000}km</p>
      </div>
      </div>
      <div class="relay">
        <img src=${pointRelais.URL_Photo} alt="picture not available">
      </div>  
          <div class="relay" id="schedule">
            <p id="schedule-text">Horaires :</p>
            ${scheduling}
          </div>
        </section>
        `);

    // on enregistre des infos du points relay afin de pouvoir les afficher sur la carte
    let relayInfo = {
      type: "Relay",
      properties: {
        message: pointRelais.Adresse,
        iconSize: [60, 60],
        id: id,
      },
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(pointRelais.Longitude.replace(",", ".")),
          parseFloat(pointRelais.Latitude.replace(",", ".")),
        ],
      },
    };
    geojson.relays.push(relayInfo);
    id++;
  });

  // on affiche la liste des points relais
  document.querySelector("#relays").innerHTML = listRelay;

  // on créer une fonction récursive afin que lorsque l'on clique sur un points relais de liste alors la fiche de celui-ci remplace la liste et si l'on clique sur la fiche alors la liste remplace la fiche
  const addEvent = (id, listRelay, detailRelay) => {
    for (let i = 0; i < id; i++) {
      document.getElementById(`${i}`).addEventListener("click", () => {
        document.querySelector("#relays").innerHTML = detailRelay[i];
        document.getElementById(`${i}`).addEventListener("click", () => {
          document.querySelector("#relays").innerHTML = listRelay;
          addEvent(id, listRelay, detailRelay);
        });
      });
    }
  };

  addEvent(id, listRelay, detailRelay);

  mapboxgl.accessToken =
    "pk.eyJ1Ijoia2VybzMzMzMiLCJhIjoiY2t6MmgwZThnMGM1dDJxb2R3aW1iZ2hvMSJ9.x9p6pHXQRllrCII-MLsjnw";

  // on affiche la carte et on la centre sur les coordonnées du premier point relais trouvé
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: geojson.relays[0].geometry.coordinates,
    zoom: 11,
  });

  // on créer un point pour chaque points relais trouvés sur la carte
  for (const marker of geojson.relays) {
    const el = document.createElement("div");
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];
    el.className = "marker";
    el.style.backgroundImage = `url(https://cdn.iconscout.com/icon/premium/png-256-thumb/placeholder-2043667-1723503.png)`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = "100%";

    // lorsqu'on clique sur le point, on affiche la fiche du point relais
    el.addEventListener("click", () => {
      document.querySelector("#relays").innerHTML =
        detailRelay[marker.properties.id];
      document
        .getElementById(`${marker.properties.id}`)
        .addEventListener("click", () => {
          document.querySelector("#relays").innerHTML = listRelay;
          addEvent(id, listRelay, detailRelay);
        });
    });

    // on ajoute le point sur la carte
    new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
  }
});
