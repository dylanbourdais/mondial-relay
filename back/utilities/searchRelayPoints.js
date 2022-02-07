const md5 = require("md5");
const { toXML } = require("jstoxml");
const axios = require("axios");
const convert = require("xml-js");

module.exports = async (body, res) => {
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
    let horaires = {};
    days.forEach((day) => {
      el.Horaires[day] = Object.values(el[`Horaires_${day}`])
        .map((el) => {
          return el.replace(/\[object Object\]/g, "").split(",");
        })
        .toString()
        .split(",");
      horaires[day] = [];
      el.Horaires[day].forEach((hour) => {
        if (hour !== "0000") {
          if (hour[2] === "0" && hour[3] === "0") {
            horaires[day].push(`${hour.slice(0, 2)}h`);
          } else {
            horaires[day].push(`${hour.slice(0, 2)}h${hour.slice(2)}`);
          }
        }
      });
      if (horaires[day].length !== 0) el.Horaires[day] = horaires[day];
      else {
        delete el.Horaires[day];
      }
      delete el[`Horaires_${day}`];
    });
  });
  return pointsRelais;
};
