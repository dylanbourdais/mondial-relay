const express = require("express");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

const connexion = require("./db/connect");
const User = require("./model/User.js");

connexion();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:1234");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  next();
});

app.get("", (req, res) => {
  res.send("ok");
});

app.post("/register", async (req, res) => {
  console.log(req.body);
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
  const passMd5 = md5(req.body.pass);

  const user = {
    email: req.body.email,
    pass: passMd5,
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
    algorithms: "HS256",
    expiresIn: "30000000s",
  });
  res.send({ token });
});

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  console.log("bearerHeader = " + bearerHeader);
  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    return res.status(403);
  }
};

app.post("/profil", verifyToken, (req, res) => {
  const decoded = jwt.verify(req.token, "secretkey", { algorithms: ["HS256"] });
  console.log(decoded);
  // jwt.verify(req.token, "secretkey", (err, authUser) => {
  //   if (err) {
  //     console.log(err.message);
  //     res.status(403).send("not ok");
  //   } else {
  //     console.log(authUser);
  //     res.status(200).send("ok");
  //   }
  // });
});

app.listen(3001, () => console.log("listenning on port 3001"));
