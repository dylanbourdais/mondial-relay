const express = require("express");
const User = require("../model/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const _ = require("lodash");

const verifyToken = require("../middlewares/verifyToken");
const Etiquette = require("../model/Etiquette");

router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
  const passMd5 = md5(req.body.pass);

  const user = {
    email: req.body.email,
    pass: passMd5,
  };

  const rep = await User.findOne({
    email: user.email,
    password: user.pass,
  }).exec();
  if (!rep) {
    return res.status(400).send("invalid email or invalid password");
  }

  const token = jwt.sign({ id: _.pick(rep, "_id") }, "secretkey", {
    algorithm: "HS256",
  });
  res.send({ emailUser: user.email, token });
});

router.post("/auth", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -_id -__v");

  if (!user) {
    return res.status(400).send({ message: "Invalid token" });
  }

  res.send(user);
});

router.post("/etiquette", async (req, res) => {
  console.log(req.body);
  const etiquette = new Etiquette({
    num: req.body.etiquette.num,
    url: req.body.etiquette.url,
    emailUser: req.body.etiquette.emailUser,
  });

  await etiquette.save();

  res.send(etiquette);
});

router.post("/myEtiquettes", async (req, res) => {
  const ettiquettes = await Etiquette.find(req.body.emailUser).select(
    "-_id -emailUser -__v"
  );
  console.log(ettiquettes);
  res.send(ettiquettes);
});

router.post("/updateAddress", async (req, res) => {
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
  res.send("ok");
});

router.post("/updateProfil", async (req, res) => {
  const rep = await User.updateOne({ mail: req.body.email }, req.body.user);
  if (rep.modifiedCount === 1) {
    res.send({ email: req.body.user.email });
  }
  res.status(200).send("Profil is already update");
});

router.post("/prefillEtiquette", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  res.send(user);
});

module.exports = router;
