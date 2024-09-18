import { User } from "../models/usersModel.js";
import { signupValidator, subValidator } from "../validator/validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { authToken } from "../middleware/auth.js";

const { SECRET_KEY } = process.env;

const signupUser = async (req, res) => {

	const { error, value } = signupValidator(req.body);
	console.log(req.headers)
	if (error) return res.status(400).json({message: error.message});

	try {
		const {email, password} = value;

		const userExist = await User.findOne({ email });

		if (userExist) return res.status(409).json({ message: "Email is already taken!" });

		const hashedPassword = await bcrypt.hash(password, 10);

		await User.create({ email, password: hashedPassword });

		return res.status(201).json({ message: "Successfully Registered!" });
	} catch (e) {
		res.status(400).json(e.message);
	}
};

const loginUser = async (req, res) => {
	const { error, value } = signupValidator(req.body);
	const { email, password } = value;

	if (error) return res.status(400).json({message: error.message});

	const existingUser = await User.findOne({ email });

	try {

		if (!existingUser) return res.status(401).json({ message: "Wrong email or password!"});
		
		const passwordMatched = await bcrypt.compare(password, existingUser.password);

		if (!passwordMatched) return res.status(400).json({ message: "Wrong password!" })

		const payload = { id: existingUser._id	}
		const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h"});
		
		await User.findByIdAndUpdate(existingUser._id, {token});

		return res.status(200).json({ message: "Welcome user!" });
		
	} catch (e) {
		res.status(400).json(e.message);
	}
};

const logoutUser = async (req, res) => {	
	try {
		await User.findByIdAndUpdate(req.user.id, { token: "" });
		
		return res.status(200).json({ message: "Logout!" })
	} catch (e) {
		res.status(400).json(e.message);	
	}
};

const getCurrentUser = async (req, res) => {
	try {
		return res.status(200).json(req.user);
	} catch (e) {
		res.status(400).json(e.message);
	}
};

const updateSubscription = async (req, res) => {
	const { error, value } = subValidator(req.body);
	
	if (error) return res.status(400).json({ message: error.message }); 
	console.log(value)
	try {
		const _id = req.user.id;
		await User.findByIdAndUpdate(_id, value, { new: true });
		return res.status(200).json({message: "Subscription Updated!"});
	} catch (e) {
		res.status(400).json(e.message);
	}
}

export {
	signupUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	updateSubscription
};