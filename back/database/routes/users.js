const express = require("express");
const User = require("../model/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const _ = require("lodash");

router.post("", (req, res) => {
  res.send("ok");
});

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

  const token = jwt.sign({ user: User }, "secretkey", {
    algorithm: "HS256",
    expiresIn: "3000s",
  });
  try {
    await newUser.save();
    return res
      .header("x-auth-token", token)
      .status(201)
      .send({
        data: _.pick({ _id: _.pick(newUser, ["_id"]) }, [
          "firstName",
          "lastName",
          "email",
        ]),
      });
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

  const rep = await User.find({
    email: user.email,
    password: user.pass,
  }).exec();
  if (!rep.length) {
    return res.status(404).send("invalid email or invalid password");
  }
  const token = jwt.sign(user, "secretkey", {
    algorithm: "HS256",
  });
  res.send({ emailUser: user.email, token });
});

module.exports = router;
