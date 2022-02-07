const express = require("express");

// on importe le module qui permet la connexion avec la base de données
const connexion = require("./db/connect");

// on importe les routes
const usersRoutes = require("./routes/user");
const apiSearchRoutes = require("./routes/search");
const apiCreateEtiquette = require("./routes/etiquette");
const loginRoute = require("./routes/login");

connexion(); // on se connecte à la base de données

const app = express();

app.use(express.json());

// pour passer CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:1234");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  next();
});

// les différents routes du serveur
app.use("/user", usersRoutes);
app.use("/login", loginRoute);
app.use("/api/search", apiSearchRoutes);
app.use("/api/createEtiquette", apiCreateEtiquette);
app.use("/etiquette", apiCreateEtiquette);

app.listen(3000, () => console.log("server listenning on port 3000"));
