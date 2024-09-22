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
});

const signupSchema = Joi.object({
	email: Joi
		.string()
		.email({
			minDomainSegments: 2,
			tlds: { 
				allow: ["com", "net"]
			}
		})
		.required()
		.messages({
			"any.required": "Email is required",
			"string.email": "Invalid email format"
		}),
	password: Joi
		.string()
		.min(6)
		.max(18)
		.required()
		.messages({
			"any.required": "Password is required",
			"string.min": "Password must be atleast 6 characters!",
			"string.max": "Password cannot be longer than {#limit} characters!"
		}),
});

const subscriptionSchema = Joi.object({
	subscription: Joi.string().valid("starter", "pro", "business")
});

export const contactValidator = validator(contactSchema);
export const favValidator = validator(favoriteSchema);
export const signupValidator = validator(signupSchema);
export const subValidator = validator(subscriptionSchema);