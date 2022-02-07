const express = require("express");
const router = express.Router();

const searchRelayPoints = require("../utilities/searchRelayPoints");

const validateSearchRelays = require("../utilities/schemaValidateSearchRelays");

// recherche de points relais à partir de la ville
router.get("/:pays/ville/:ville", async (req, res) => {
  const { query, params } = req;
  const body = {};
  if (query.results === undefined) {
    body.NombreResultats = 10;
  } else {
    body.NombreResultats = query.results;
  }
  body.Pays = params.pays;
  body.Ville = params.ville;
  body.CP = query.cp;
  body.RayonRecherche = query.rayon;
  body.Enseigne = "BDTEST13";

  const { error } = validateSearchRelays(body);

  if (error) {
    let err = [];
    error.details.forEach((el) => {
      err.push(el.message);
    });
    return res.status(400).send(err.toString());
  }

  const pointsRelais = await searchRelayPoints(body, res);
  res.status(200).send(pointsRelais);
});

// recherche de points relais à partir du code postale
router.get("/:pays/cp/:cp", async (req, res) => {
  const { query, params } = req;
  const body = {};
  if (query.results === undefined) {
    body.NombreResultats = 10;
  } else {
    body.NombreResultats = query.results;
  }
  body.Pays = params.pays;
  body.CP = params.cp;
  body.Ville = query.ville;
  body.RayonRecherche = query.rayon;
  body.Enseigne = "BDTEST13";

  const { error } = validateSearchRelays(body);

  if (error) {
    let err = [];
    error.details.forEach((el) => {
      err.push(el.message);
    });
    return res.status(400).send(err.toString());
  }

  const pointsRelais = await searchRelayPoints(body, res);
  res.status(200).send(pointsRelais);
});

// recherche de points relais à partir des informations envoyées dans le body de la requête
router.post("", async (req, res) => {
  const { body } = req;
  body.Enseigne = "BDTEST13";
  const { error } = validateSearchRelays(body);

  if (error) {
    let err = [];
    error.details.forEach((el) => {
      err.push(el.message);
    });
    return res.status(400).send(err.toString());
  }

  const pointsRelais = await searchRelayPoints(body, res);
  res.status(200).send(pointsRelais);
});

module.exports = router;
