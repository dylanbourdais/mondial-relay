const express = require("express");

const connexion = require("./db/connect");
const User = require("./model/User.js");

connexion();

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

app.get("", (req, res) => {
  res.send("ok");
});

app.post("/register", async (req, res) => {
  console.log(req.body);

  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await newUser.save();
    return res.status(201).send({ message: true, data: newUser });
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(3001, () => console.log("listenning on port 3001"));
