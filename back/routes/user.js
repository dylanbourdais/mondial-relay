const express = require("express");
const User = require("../model/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const validateNewUser = require("../utilities/schemaValidateNewUser");
const validateAddress = require("../utilities/schemaValidateAddress");
const validateUserUpdate = require("../utilities/schemaValidateUserUpdate");

// on enregistre un nouvel utilisateur
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { error } = validateNewUser(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const rep = await User.findOne({
    email: email,
  });
  if (rep) {
    return res.status(400).send("invalid email or invalid password");
  }

  const hash = bcrypt.hashSync(password, 10);

  const newUser = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hash,
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
    res.status(500).send(err.message);
  }
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
  const { user } = req.body;

  const { error } = validateUserUpdate(user);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  const rep = await User.updateOne({ mail: req.body.email }, user);
  if (rep.modifiedCount === 1) {
    return res.send({ email: user.email });
  }
  res.status(200).send("Profil is already update");
});

module.exports = router;
