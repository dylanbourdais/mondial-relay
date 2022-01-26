//const axios = require("axios");
const form = document.querySelector("form");
form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const params = {
    };
    params.Pays = e.target.Pays.value;
    params.Ville = e.target.Ville.value;
    params.CP = e.target.CP.value;
    params.RayonRecherche = e.target.RayonRecherche.value;
    params.NombreResultats = e.target.NombreResultats.value;
    console.log(params.Ville);
});

//# sourceMappingURL=search.6995ec62.js.map
