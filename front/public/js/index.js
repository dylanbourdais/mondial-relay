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
  const geojson = {
    type: "Relay",
    relays: [],
  };

  let listRelay = "";
  let detailRelay = [];
  let id = 0;

  document.querySelector("#relays").innerHTML = ``;

  data.forEach((pointRelais) => {
    let addressForm = pointRelais.Adresse.split(",");
    addressForm.splice(4, 1);
    addressForm.shift();
    const city = addressForm.splice(0, 2);

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
        <p>${city.toString()}</p>
        <p>${addressForm.toString()}</p>
      </div>
      <div class="relay">
        <p>Distance : ${pointRelais.Distance / 1000}km</p>
      </div>
      </div>
    </section>
    `;

    document.querySelector("#relays").innerHTML = listRelay;

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
    let address = pointRelais.Adresse.replace(/,/g, ", ");

    detailRelay.push(`
    <section class="relay-section relay-detail" id=${id}>
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
        <p>${city.toString()}</p>
        <p>${addressForm.toString()}</p>
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

  const addEvent = (id, listRelay, detailRelay) => {
    for (let i = 0; i < id; i++) {
      document.getElementById(`${i}`).addEventListener("click", (e) => {
        document.querySelector("#relays").innerHTML = detailRelay[i];
        document.getElementById(`${i}`).addEventListener("click", (e) => {
          document.querySelector("#relays").innerHTML = listRelay;
          addEvent(id, listRelay, detailRelay);
        });
      });
    }
  };

  addEvent(id, listRelay, detailRelay);

  mapboxgl.accessToken =
    "pk.eyJ1Ijoia2VybzMzMzMiLCJhIjoiY2t6MmgwZThnMGM1dDJxb2R3aW1iZ2hvMSJ9.x9p6pHXQRllrCII-MLsjnw";

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: geojson.relays[0].geometry.coordinates,
    zoom: 11,
  });

  // Add markers to the map.
  for (const marker of geojson.relays) {
    // Create a DOM element for each marker.
    console.log(marker);
    const el = document.createElement("div");
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];
    el.className = "marker";
    el.style.backgroundImage = `url(https://cdn.iconscout.com/icon/premium/png-256-thumb/placeholder-2043667-1723503.png)`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = "100%";

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

    // Add markers to the map.
    new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
  }
});
