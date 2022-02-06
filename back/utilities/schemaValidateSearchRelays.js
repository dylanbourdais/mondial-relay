const Joi = require("joi");

const validate = (obj) => {
  const schema = Joi.object({
    Enseigne: Joi.string()
      .regex(/^[0-9A-Z]{2}[0-9A-Z ]{6}$/)
      .required(),
    Pays: Joi.string()
      .regex(/^[A-Za-z]{2}$/)
      .required(),
    Ville: Joi.string().regex(/^[A-Za-z_\-' ]{2,25}$/),
    CP: Joi.any(),
    NombreResultats: Joi.number().integer().min(1).max(30).required(),
    RayonRecherche: Joi.number().integer().min(1).max(9999),
  });
  return schema.validate(obj, { abortEarly: false });
};

module.exports = validate;
