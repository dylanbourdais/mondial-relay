const mongoose = require("mongoose");
require("mongoose-type-email");

const User = mongoose.model("User", {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: mongoose.SchemaTypes.Email, required: true },
  password: { type: String, required: true },
});

module.exports = User;
