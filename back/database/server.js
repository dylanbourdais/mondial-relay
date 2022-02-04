const { LogTimings } = require("concurrently");
const express = require("express");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const connexion = require("./db/connect");
const User = require("./model/User");
const Etiquette = require("./model/Etiquette");
const usersRoutes = require("./routes/users");

connexion();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:1234");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  next();
});

app.use("/user", usersRoutes);

app.get("", (req, res) => {
  res.send("ok");
});

// app.post("/register", async (req, res) => {
//   const rep = await User.find({
//     email: req.body.email,
//   }).exec();
//   if (rep.length) {
//     return res.status(400).send("wrong email or wrong password");
//   }

//   const passMd5 = md5(req.body.password);
//   const newUser = new User({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: passMd5,
//   });

//   const token = jwt.sign({ user: User }, "secretkey", {
//     algorithm: "HS256",
//     expiresIn: "3000s",
//   });
//   try {
//     await newUser.save();
//     return res.status(201).send({
//       data: _.pick(newUser, ["firstName", "lastName", "email"]),
//       token,
//     });
//   } catch (err) {
//     console.log(err.message);
//   }
// });

// app.post("/login", async (req, res) => {
//   const passMd5 = md5(req.body.pass);

//   const user = {
//     email: req.body.email,
//     pass: passMd5,
//   };

//   const rep = await User.find({
//     email: user.email,
//     password: user.pass,
//   }).exec();
//   if (!rep.length) {
//     return res.status(404).send("wrong email or wrong password");
//   }
//   const token = jwt.sign(user, "secretkey", {
//     algorithm: "HS256",
//   });
//   res.send({ emailUser: user.email, token });
// });

// const verifyToken = (req, res, next) => {
//   const token = req.headers["x-auth-token"];

//   if (!token) {
//     return res.status(401).send("Unauthorized");
//   }
//   try {
//     const decodedToken = jwt.verify(token, "secretkey");

//     req.userId = decodedToken;

//     next();
//   } catch (err) {
//     res.status(400).send("Invalid token");
//   }
// };

// app.post("/profil", verifyToken, async (req, res) => {
//   const user = await User.findOne(req.userId);

//   if (!user) {
//     return res.status(400).send({ message: "Invalid token" });
//   }

//   res.send(user);
// });

// app.post("/etiquette", async (req, res) => {
//   console.log(req.body);
//   const etiquette = new Etiquette({
//     num: req.body.etiquette.num,
//     url: req.body.etiquette.url,
//     emailUser: req.body.etiquette.emailUser,
//   });

//   await etiquette.save();
// });

app.listen(3001, () => console.log("listenning on port 3001"));
