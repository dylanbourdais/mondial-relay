const mongoose = require("mongoose");
require("mongoose-type-email");

const User = mongoose.model("User", {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: mongoose.SchemaTypes.Email, required: true },
  password: { type: String, required: true },
  address: { street: String, compl: String, zip: String, city: String },
});

module.exports = User;
