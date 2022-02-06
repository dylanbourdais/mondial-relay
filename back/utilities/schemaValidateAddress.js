const Joi = require("joi");

const validate = (obj) => {
  const schema = Joi.object({
    street: Joi.string()
      .regex(/^[0-9A-Z_\-'., /]{2,32}$/)
      .required(),
    compl: Joi.string()
      .regex(/^[0-9A-Z_\-'., /]{2,32}$/)
      .required(),
    city: Joi.string()
      .regex(/^[A-Z_\-' ]{2,26}$/)
      .required(),
    zip: Joi.string()
      .regex(/^[0-9@]{1}[0-9]{4}$/)
      .required(),
  });
  return schema.validate(obj);
};

module.exports = validate;
