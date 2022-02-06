const express = require("express");
const User = require("../model/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const _ = require("lodash");

const validateLogin = require("../utilities/schemaValidateLogin");

// connexion à un compte
router.post("", async (req, res) => {
  const { error } = validateLogin(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const passMd5 = md5(req.body.password);

  const user = {
    email: req.body.email,
    password: passMd5,
  };

  const rep = await User.findOne({
    email: user.email,
    password: user.password,
  }).exec();
  if (!rep) {
    return res.status(400).send("invalid email or invalid password");
  }

  const token = jwt.sign({ id: _.pick(rep, "_id") }, "secretkey", {
    algorithm: "HS256",
  });
  res.send({ emailUser: user.email, token });
});

module.exports = router;
