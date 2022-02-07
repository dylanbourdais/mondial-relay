const axios = require("axios");
const verifyUser = require("./modules/verifyUser");

const getEtiquettes = async () => {
  // on vérifie l'identité de l'utilisateur et on récupère son email
  const { email } = await verifyUser();

  // on construit et on envoie la requête
  const options = {
    method: "post",
    url: "http://localhost:3000/etiquette/myEtiquettes",
    data: email,
  };

  try {
    const { data } = await axios(options);

    //pour chaque étiquette, on affiche le numéro de celui-ci ainsi que son lien de téléchargement
    data.forEach((etiquette) => {
      const num = `
        <div class="mb-3 row">
        <label for="staticNum" class="col-sm-2 col-form-label">Num</label>
        <div class="col-sm-10">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            id="staticfirstNum"
            value="${etiquette.num}"
          />
        </div>
      </div>
        `;

      const url = `
        <button class="btn btn-primary"><a href="${etiquette.url}">Download</a></button>
        `;

      document.querySelector("main").innerHTML += `
        ${num}
        ${url}
        `;
    });
  } catch (err) {
    document.querySelector("span").textContent = err.message;
  }
};

getEtiquettes();
