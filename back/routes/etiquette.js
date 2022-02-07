const express = require("express");
const router = express.Router();
const md5 = require("md5");
const { toXML } = require("jstoxml");
const axios = require("axios");
const convert = require("xml-js");

const Etiquette = require("../model/Etiquette");
const validateEtiquette = require("../utilities/schemaValidateEtiquette");

// création d'étiquette
router.post("", async (req, res) => {
  req.body.Enseigne = "BDTEST13";

  const { error } = validateEtiquette(req.body);

  if (error) {
    let err = [];
    error.details.forEach((el) => {
      err.push(el.message);
    });
    return res.status(400).send(err.toString());
  }
  if (req.body.ModeLiv === "LD1" || req.body.ModeLiv === "LDS") {
    if (req.body.Dest_Tel1 === undefined) {
      return res.status(400).send("Veuillez renseigner Dest_Tel1");
    }
  }
  let security = `${req.body.Enseigne}${req.body.ModeCol}${req.body.ModeLiv}${req.body.Expe_Langage}${req.body.Expe_Ad1}${req.body.Expe_Ad3}${req.body.Expe_Ville}${req.body.Expe_CP}${req.body.Expe_Pays}${req.body.Expe_Tel1}${req.body.Dest_Langage}${req.body.Dest_Ad1}${req.body.Dest_Ad3}${req.body.Dest_Ville}${req.body.Dest_CP}${req.body.Dest_Pays}${req.body.Dest_Tel1}${req.body.Poids}${req.body.NbColis}${req.body.CRT_Valeur}${req.body.COL_Rel_Pays}${req.body.COL_Rel}${req.body.LIV_Rel_Pays}${req.body.LIV_Rel}PrivateK`;
  security = security.replace(/undefined/g, "");

  const hash = md5(`${security}`).toUpperCase();
  req.body.Security = hash;

  // make the xml request
  const dataXml = toXML(req.body);

  const bodyXml = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <WSI2_CreationEtiquette xmlns="http://www.mondialrelay.fr/webservice/">
            ${dataXml}
          </WSI2_CreationEtiquette>
        </soap:Body>
      </soap:Envelope>`;

  const options = {
    method: "post",
    url: "http://api.mondialrelay.com/Web_Services.asmx",
    headers: {
      "Content-Type": "text/xml",
    },
    data: bodyXml,
  };

  // get the reponse of the xml request to mondialrelay api
  const { data: result } = await axios(options);

  // verify if the value of property is a number or not
  const nativeType = (value) => {
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      return numberValue;
    }
    return value;
  };

  // delete the property "_text" and add his value to the property parent
  const removeJsonTextAttribute = (value, parentElement) => {
    const positionKey = Object.keys(parentElement._parent).length - 1;
    const keys = Object.keys(parentElement._parent);
    const key = keys[positionKey];
    if (key === "string") {
      parentElement._parent[key] += value;
    } else {
      parentElement._parent[key] = nativeType(value);
    }
  };

  // convert the xml response to json format
  const opts = {
    compact: true,
    trim: true,
    ignoreComment: true,
    ignoreAttributes: true,
    ignoreDeclaration: true,
    textFn: removeJsonTextAttribute,
  };
  const resultJson = JSON.parse(convert.xml2json(result, opts));

  const etiquette =
    resultJson["soap:Envelope"]["soap:Body"]["WSI2_CreationEtiquetteResponse"][
      "WSI2_CreationEtiquetteResult"
    ];
  etiquette.URL_Etiquette = `https://www.mondialrelay.fr${etiquette.URL_Etiquette}`;
  res.status(200).send(etiquette);
});

// on sauvegarde une étiquette dans la BD qu'on associe à un utilisateur
router.post("/save", async (req, res) => {
  const etiquette = new Etiquette({
    num: req.body.etiquette.num,
    url: req.body.etiquette.url,
    emailUser: req.body.etiquette.emailUser,
  });

  await etiquette.save();

  res.send(etiquette);
});

// on récupère les étiquettes que l'utilisateur a crées
router.post("/myEtiquettes", async (req, res) => {
  const etiquettes = await Etiquette.find(req.body.emailUser).select(
    "-_id -emailUser -__v"
  );
  if (!etiquettes.length) {
    return res.status(404).send("Not found an etiquette");
  }
  res.send(etiquettes);
});
module.exports = router;
