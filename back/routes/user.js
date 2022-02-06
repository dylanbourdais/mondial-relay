const express = require("express");
const User = require("../model/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const _ = require("lodash");

const verifyToken = require("../middlewares/verifyToken");
const Etiquette = require("../model/Etiquette");
const validateNewUser = require("../utilities/schemaValidateNewUser");
const validateAddress = require("../utilities/schemaValidateAddress");
const validateUserUpdate = require("../utilities/schemaValidateUserUpdate");

// on enregistre un nouvel utilisateur
router.post("/register", async (req, res) => {
  const { error } = validateNewUser(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const rep = await User.find({
    email: req.body.email,
  }).exec();
  if (rep.length) {
    return res.status(400).send("invalid email or invalid password");
  }

  const passMd5 = md5(req.body.password);
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: passMd5,
  });

  try {
    await newUser.save();

    const token = jwt.sign({ id: _.pick(newUser, "_id") }, "secretkey", {
      algorithm: "HS256",
    });

    return res
      .header("x-auth-token", token)
      .status(201)
      .send({ emailUser: newUser.email, token });
  } catch (err) {
    console.log(err.message);
  }
});

// on vérifie l'identité de l'utilisateur et renvoie les informations de celui-ci
router.post("/auth", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -_id -__v");

  if (!user) {
    return res.status(400).send({ message: "Invalid token" });
  }

  res.send(user);
});

// on sauvegarde une étiquette dans la BD qu'on associe à un utilisateur
router.post("/etiquette", async (req, res) => {
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
  res.send(etiquettes);
});

// on modifie l'adresse postale de l'utilisateur
router.post("/updateAddress", async (req, res) => {
  const { error } = validateAddress(req.body.address);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const rep = await User.updateOne(
    { mail: req.body.email },
    {
      address: {
        street: req.body.address.street,
        compl: req.body.address.compl,
        zip: req.body.address.zip,
        city: req.body.address.city,
      },
    }
  );
  console.log(
    "found : " + rep.matchedCount + " modified :" + rep.modifiedCount
  );
  res.send("Address saved");
});

// on modifie le profil de l'utilisateur
router.post("/updateProfil", async (req, res) => {
  const { error } = validateUserUpdate(req.body.user);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const rep = await User.updateOne({ mail: req.body.email }, req.body.user);
  if (rep.modifiedCount === 1) {
    res.send({ email: req.body.user.email });
  }
  res.status(200).send("Profil is already update");
});

module.exports = router;
