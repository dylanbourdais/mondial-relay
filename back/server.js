const express = require("express");
const md5 = require("md5");
const { toXML } = require("jstoxml");
const axios = require("axios");
const convert = require("xml-js");
const Joi = require("joi");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:1234");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const searchPointsRelais = async (body, res) => {
  body.Enseigne = "BDTEST13";

  // schema of req.body
  const schema = Joi.object({
    Enseigne: Joi.string()
      .regex(/^[0-9A-Z]{2}[0-9A-Z ]{6}$/)
      .required(),
    Pays: Joi.string()
      .regex(/^[A-Za-z]{2}$/)
      .required(),
    Ville: Joi.string().regex(/^[A-Za-z_\-' ]{2,25}$/),
    CP: Joi.any(),
    NombreResultats: Joi.number().integer().min(1).max(30).required(),
    RayonRecherche: Joi.number().integer().min(1).max(9999),
  });

  // verification of req.body
  const { error } = schema.validate(body, { abortEarly: false });

  if (error) {
    let err = [];
    error.details.forEach((el) => {
      err.push(el.message);
    });
    return res.status(400).send(err.toString());
  }

  // make the key hash
  let security = `${body.Enseigne}${body.Pays}${body.Ville}${body.CP}${body.RayonRecherche}${body.NombreResultats}PrivateK`;
  security = security.replace(/undefined/g, "");

  const hash = md5(`${security}`).toUpperCase();
  body.Security = hash;

  // make the xml request
  const dataXml = toXML(body);

  const bodyXml = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <WSI4_PointRelais_Recherche xmlns="http://www.mondialrelay.fr/webservice/">
          ${dataXml}
        </WSI4_PointRelais_Recherche>
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

  // get "points relais" of the result json
  let pointsRelais = [];

  const stat =
    resultJson["soap:Envelope"]["soap:Body"][
      "WSI4_PointRelais_RechercheResponse"
    ]["WSI4_PointRelais_RechercheResult"];

  if (stat.hasOwnProperty("PointsRelais") === false) {
    if (stat.STAT === 9) {
      return res.status(400).send("Ville non reconnu ou non unique");
    }
    return res.status(400).send(stat);
  }

  const pointRelaisDetails =
    resultJson["soap:Envelope"]["soap:Body"][
      "WSI4_PointRelais_RechercheResponse"
    ]["WSI4_PointRelais_RechercheResult"]["PointsRelais"][
      "PointRelais_Details"
    ];

  if (pointRelaisDetails.length === undefined) {
    pointsRelais = [pointRelaisDetails];
  } else {
    pointsRelais = Object.values(pointRelaisDetails);
  }
  // format the response to send
  pointsRelais.forEach((el) => {
    // Delete empty properties
    for (let prop in el) {
      if (typeof el[prop] === "object") {
        if (Object.keys(el[prop]).length === 0) {
          delete el[prop];
        }
      }
    }

    // add property address
    const addProperty = [
      "LgAdr1",
      "LgAdr3",
      "Ville",
      "CP",
      "Pays",
      "Localisation1",
    ];
    const address = [];

    addProperty.forEach((prop) => {
      if (prop !== "Localisation1") address.unshift(el[prop]);
      else if (el[prop] !== undefined && prop === "Localisation1") {
        address.push(el[prop]);
      }
      delete el[prop];
    });

    el.Adresse = address.toString();

    // format the property Horaires
    const days = [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ];
    el.Horaires = {};

    days.forEach((day, i) => {
      el.Horaires[day] = Object.values(el[`Horaires_${day}`])
        .map((el) => {
          return el.replace(/\[object Object\]/g, "").split(",");
        })
        .toString()
        .split(",");
      delete el[`Horaires_${day}`];
    });
  });
  return pointsRelais;
};

app.get("", (req, res) => {
  res.status(200).send("homepage");
});

app.get("/api/search/:pays/ville/:ville", async (req, res) => {
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

  const pointsRelais = await searchPointsRelais(body, res);
  const days = pointsRelais.Horaires;
  res.status(200).send(pointsRelais);
});

app.get("/api/search/:pays/cp/:cp", async (req, res) => {
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

  const pointsRelais = await searchPointsRelais(body, res);
  res.status(200).send(pointsRelais);
});

app.post("/api/search/", async (req, res) => {
  const pointsRelais = await searchPointsRelais(req.body, res);
  res.status(200).send(pointsRelais);
});

app.post("/api/createEtiquette/", async (req, res) => {
  req.body.Enseigne = "BDTEST13";

  // schema of req.body
  const schema = Joi.object({
    Enseigne: Joi.string()
      .regex(/^[0-9A-Z]{2}[0-9A-Z ]{6}$/)
      .required(),
    ModeCol: Joi.string()
      .regex(/^(CCC|CDR|CDS|REL)$/)
      .required(),
    ModeLiv: Joi.string()
      .regex(/^(LCC|LD1|LDS|24R|24L|24X|ESP|DRI)$/)
      .required(),
    Expe_Langage: Joi.string()
      .regex(/^[A-Z]{2}$/)
      .required(),
    Expe_Ad1: Joi.string()
      .regex(/^[0-9A-Z_\-'., /]{2,32}$/)
      .required(),
    Expe_Ad3: Joi.string()
      .regex(/^[0-9A-Z_\-'., /]{2,32}$/)
      .required(),
    Expe_Ville: Joi.string()
      .regex(/^[A-Z_\-' ]{2,26}$/)
      .required(),
    Expe_CP: Joi.string()
      .regex(/^[0-9@]{1}[0-9]{4}$/)
      .required(),
    Expe_Pays: Joi.string()
      .regex(/^[A-Z]{2}$/)
      .required(),
    Expe_Tel1: Joi.string()
      .regex(/^((00|\+)33|0)[0-9][0-9]{8}$/)
      .required(),
    Dest_Langage: Joi.string()
      .regex(/^[A-Z]{2}$/)
      .required(),
    Dest_Ad1: Joi.string()
      .regex(/^[0-9A-Z_\-'., /]{2,32}$/)
      .required(),
    Dest_Ad3: Joi.string()
      .regex(/^[0-9A-Z_\-'., /]{2,32}$/)
      .required(),
    Dest_Ville: Joi.string()
      .regex(/^[A-Z_\-' ]{2,26}$/)
      .required(),
    Dest_CP: Joi.string()
      .regex(/^[0-9@]{1}[0-9]{4}$/)
      .required(),
    Dest_Pays: Joi.string()
      .regex(/^[A-Z]{2}$/)
      .required(),
    Dest_Tel1: Joi.string().regex(/^((00|\+)33|0)[0-9][0-9]{8}$/),
    Poids: Joi.number().min(100).max(9999999).required(),
    NbColis: Joi.number().min(1).max(99).required(),
    CRT_Valeur: Joi.number().min(1).max(9999999).required(),
    COL_Rel_Pays: Joi.string().regex(/^[A-Z]{2}$/),
    COL_Rel: Joi.string().regex(/^([0-9]{6}|AUTO)$/),
    LIV_Rel_Pays: Joi.string().regex(/^[A-Z]{2}$/),
    LIV_Rel: Joi.number().min(1).max(999999),
  });

  // verification of req.body
  const { error } = schema.validate(req.body, { abortEarly: false });

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

app.listen(3000, () =>
  console.log("server listenning on http://127.0.0.1:3000")
);
