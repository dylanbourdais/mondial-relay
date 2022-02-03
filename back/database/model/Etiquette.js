const mongoose = require("mongoose");
require("mongoose-type-email");

const Etiquette = mongoose.model("Etiquette", {
  num: { type: String, required: true },
  url: { type: String, required: true },
  emailUser: { type: mongoose.SchemaTypes.Email, required: true },
});

module.exports = Etiquette;
