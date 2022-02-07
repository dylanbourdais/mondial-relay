const Joi = require("joi");

const validate = (obj) => {
  const schema = Joi.object({
    street: Joi.string().required(),
    compl: Joi.string().allow(""),
    city: Joi.string().required(),
    zip: Joi.string()
      .regex(/^[0-9@]{1}[0-9]{4}$/)
      .required(),
  });
  return schema.validate(obj);
};

module.exports = validate;
