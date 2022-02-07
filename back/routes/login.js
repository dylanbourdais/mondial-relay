const express = require("express");
const User = require("../model/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const verifyToken = require("../middlewares/verifyToken");
const validateLogin = require("../utilities/schemaValidateLogin");

// connexion à un compte
router.post("", async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateLogin(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const rep = await User.findOne({
    email: email,
  });

  if (!rep) {
    return res.status(400).send({ error: "invalid email or invalid password" });
  }
  if (!bcrypt.compareSync(password, rep.password)) {
    return res.status(400).send({ error: "invalid email or invalid password" });
  }

  const token = jwt.sign({ id: _.pick(rep, "_id") }, "secretkey", {
    algorithm: "HS256",
  });
  res.send({ emailUser: rep.email, token });
});

// on vérifie l'identité de l'utilisateur et renvoie les informations de celui-ci
router.post("/auth", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -_id -__v");

  if (!user) {
    return res.status(400).send({ message: "Invalid token" });
  }

  res.send(user);
});
module.exports = router;
