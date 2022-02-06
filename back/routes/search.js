const express = require("express");
const router = express.Router();

const searchRelayPoints = require("../middlewares/searchRelayPoints");

const validateSearchRelays = require("../utilities/schemaValidateSearchRelays");

// recherche de points relais à partir de la ville
router.get("/:pays/ville/:ville", async (req, res) => {
  const body = {};
  if (req.query.results === undefined) {
    body.NombreResultats = 10;
  } else {
    body.NombreResultats = req.query.results;
  }
  body.Pays = req.params.pays;
  body.Ville = req.params.ville;
  body.CP = req.query.cp;
  body.RayonRecherche = req.query.rayon;
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
  const body = {};
  if (req.query.results === undefined) {
    body.NombreResultats = 10;
  } else {
    body.NombreResultats = req.query.results;
  }
  body.Pays = req.params.pays;
  body.CP = req.params.cp;
  body.Ville = req.query.ville;
  body.RayonRecherche = req.query.rayon;
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
  body.Enseigne = "BDTEST13";
  const { error } = validateSearchRelays(req.body);

  if (error) {
    let err = [];
    error.details.forEach((el) => {
      err.push(el.message);
    });
    return res.status(400).send(err.toString());
  }

  const pointsRelais = await searchRelayPoints(req.body, res);
  res.status(200).send(pointsRelais);
});

module.exports = router;
