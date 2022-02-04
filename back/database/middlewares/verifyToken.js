const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const decodedToken = jwt.verify(token, "secretkey");

    req.user = decodedToken;

    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
