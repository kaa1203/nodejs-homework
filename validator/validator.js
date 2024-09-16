import Joi from "joi";

const validator = (schema) => (payload) => 
	schema.validate(payload, { abortEarly: false });

const contactSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	phone: Joi.string().min(11).max(15).required()
});

const favoriteSchema = Joi.object({
	favorite: Joi.boolean().required()
})

export const contactValidator = validator(contactSchema);
export const favValidator = validator(favoriteSchema);