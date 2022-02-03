const axios = require("axios");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

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
  console.log(params);
  console.log(params);

  const options = {
    method: "post",
    url: "http://127.0.0.1:3000/api/createEtiquette/",
    headers: {
      "Content-Type": "application/json",
    },
    data: params,
  };

  let rep = "";
  try {
    rep = await axios(options);
    const etiquette = {
      num: rep.data.ExpeditionNum,
      url: rep.data.URL_Etiquette,
      emailUser: localStorage.getItem("emailUser").replace(/"/g, ""),
    };

    try {
      rep = await axios.post("http://127.0.0.1:3001/etiquette/", {
        etiquette,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
  console.log(rep);
});
