const express = require("express");
const jwt = require("jsonwebtoken");

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

  const token = jwt.sign({ user: User }, "secretkey", {
    algorithm: "HS256",
    expiresIn: "3000s",
  });
  newUser.token = token;
  console.log(newUser);
  try {
    await newUser.save();
    return res.status(201).send({ data: newUser, token });
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/login", async (req, res) => {
  const user = {
    email: req.body.email,
    pass: req.body.pass,
  };
  console.log(user);
  const rep = await User.find({
    email: user.email,
    password: user.pass,
  }).exec();
  if (rep[0] === undefined) {
    return res.status(404).send("wrong email or wrong password");
  }
  const token = jwt.sign({ user: User }, "secretkey", {
    algorithm: "HS256",
    expiresIn: "3000s",
  });
  res.send({ token });
});

const verifyToken = (req, res, next) => {
  console.log("ici3");
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);

  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    return res.status(403);
  }
};

app.get("/profil", verifyToken, (req, res) => {
  console.log("ici");
  jwt.verify(req.token, "secretkey", (err) => {
    if (err) {
      console.log("ici1");
      res.sendStatus(403);
    } else {
      console.log("ici2");
      res.status(200).send("ok");
    }
  });
});

app.listen(3001, () => console.log("listenning on port 3001"));
