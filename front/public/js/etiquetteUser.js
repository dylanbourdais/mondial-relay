const axios = require("axios");
const verifyUser = require("./modules/verifyUser");

verifyUser();

const getEtiquettes = async () => {
  const options = {
    method: "post",
    url: "http://localhost:3001/user/myEtiquettes",
    data: localStorage.getItem("emailUser"),
  };

  try {
    const { data } = await axios(options);

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
    console.log(err.message);
  }
};

getEtiquettes();
