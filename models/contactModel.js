import { Schema } from "mongoose";
import mongoose from "mongoose";

const ContactSchema = new Schema({
	name: {
		type: String,
		required: [true, "Set name for contact!"],
		index: 1,
	},
	phone: {
		type: String,
		min: 11,
		max: 15,
		required: [true, "Set number for contact!"],
		unique: true
	},
	email: {
		type: String,
		required: [true, "Set email for contact!"]
	},
	favorite: {
		type: Boolean,
		default: false
	}
});

export const Contact = mongoose.model("contact", ContactSchema);
