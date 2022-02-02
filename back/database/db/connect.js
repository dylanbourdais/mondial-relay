const mangoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  const dbUrl = process.env.dbUrl;
  try {
    await mangoose.connect(dbUrl);
    console.log("Database connected");
  } catch (err) {
    console.log(err.message);
  }
};
