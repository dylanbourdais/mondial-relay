const Joi = require("joi");

const schema = Joi.object({
  firstName: Joi.string().regex(/[A-Za-z]{20}$/),
  lastName: Joi.string().regex(/[A-Za-z]{20}$/),
  email: Joi.string().email(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
