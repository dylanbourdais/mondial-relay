const Joi = require("joi");

const validate = (obj) => {
  const schema = Joi.object({
    Enseigne: Joi.string()
      .regex(/^[0-9A-Z]{2}[0-9A-Z ]{6}$/)
      .required(),
    ModeCol: Joi.string()
      .regex(/^(CCC|CDR|CDS|REL)$/)
      .required(),
    ModeLiv: Joi.string()
      .regex(/^(LCC|LD1|LDS|24R|24L|24X|ESP|DRI)$/)
      .required(),
    Expe_Langage: Joi.string()
      .regex(/^[A-Z]{2}$/)
      .required(),
    Expe_Ad1: Joi.string()
      .regex(/^[0-9A-Z_\-'., /]{2,32}$/)
      .required(),
    Expe_Ad3: Joi.string()
      .regex(/^[0-9A-Z_\-'., /]{2,32}$/)
      .required(),
    Expe_Ville: Joi.string()
      .regex(/^[A-Z_\-' ]{2,26}$/)
      .required(),
    Expe_CP: Joi.string()
      .regex(/^[0-9@]{1}[0-9]{4}$/)
      .required(),
    Expe_Pays: Joi.string()
      .regex(/^[A-Z]{2}$/)
      .required(),
    Expe_Tel1: Joi.string()
      .regex(/^((00|\+)33|0)[0-9][0-9]{8}$/)
      .required(),
    Dest_Langage: Joi.string()
      .regex(/^[A-Z]{2}$/)
      .required(),
    Dest_Ad1: Joi.string()
      .regex(/^[0-9A-Z_\-'., /]{2,32}$/)
      .required(),
    Dest_Ad3: Joi.string()
      .regex(/^[0-9A-Z_\-'., /]{2,32}$/)
      .required(),
    Dest_Ville: Joi.string()
      .regex(/^[A-Z_\-' ]{2,26}$/)
      .required(),
    Dest_CP: Joi.string()
      .regex(/^[0-9@]{1}[0-9]{4}$/)
      .required(),
    Dest_Pays: Joi.string()
      .regex(/^[A-Z]{2}$/)
      .required(),
    Dest_Tel1: Joi.string().regex(/^((00|\+)33|0)[0-9][0-9]{8}$/),
    Poids: Joi.number().min(100).max(9999999).required(),
    NbColis: Joi.number().min(1).max(99).required(),
    CRT_Valeur: Joi.number().min(1).max(9999999).required(),
    COL_Rel_Pays: Joi.string().regex(/^[A-Z]{2}$/),
    COL_Rel: Joi.string().regex(/^([0-9]{6}|AUTO)$/),
    LIV_Rel_Pays: Joi.string().regex(/^[A-Z]{2}$/),
    LIV_Rel: Joi.number().min(1).max(999999),
  });
  return schema.validate(obj, { abortEarly: false });
};

module.exports = validate;
