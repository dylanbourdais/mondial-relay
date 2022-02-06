const Joi = require("joi");

const validate = (obj) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .regex(/[A-Za-z]{3,30}$/)
      .required(),
    lastName: Joi.string()
      .regex(/[A-Za-z]{3,30}$/)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });
  return schema.validate(obj);
};

module.exports = validate;
