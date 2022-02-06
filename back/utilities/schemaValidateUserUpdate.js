const Joi = require("joi");

const validate = (obj) => {
  const schema = Joi.object({
    firstName: Joi.string().regex(/[A-Za-z]{3,30}$/),
    lastName: Joi.string().regex(/[A-Za-z]{3,30}$/),
    email: Joi.string().email(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  return schema.validate(obj);
};

module.exports = validate;
