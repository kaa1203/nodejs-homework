import { Schema } from "mongoose";
import mongoose from "mongoose";

const UserSchema = new Schema({
	password: {
		type: String,
		required: [true, "Password is required!"]
	},
	email: {
		type: String,
		required: [true, "Email is required!"],
		unique: true
	},
	subscription: {
		type: String,
		enum: ["starter", "pro", "business"],
		default: "starter"
	},
	token: {
		type: String,
		default: null,
	},
	avatarURL: {
		type: String
	}
});

export const User = mongoose.model("user", UserSchema);