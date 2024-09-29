import { User } from "../models/usersModel.js";
import { signupValidator, subValidator, resValidator } from "../validator/validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import { Jimp } from "jimp";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import { sendEmail } from "../helpers/sendEmail.js";

const { SECRET_KEY } = process.env;

const signupUser = async (req, res) => {

	const { error, value } = signupValidator(req.body);
	
	if (error) return res.status(400).json({message: error.message});

	try {
		const { email, password } = value;

		const userExist = await User.findOne({ email });

		if (userExist) return res.status(409).json({ message: "Email is already taken!" });

		const hashedPassword = await bcrypt.hash(password, 10);

		const avatarURL = gravatar.url(email, { protocol: "http" });

		const verificationToken = nanoid();
		
		await sendEmail({
			to: email,
			subject: "Action Required: Verify Your Email",
			html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click to verify email</a>`
		});
		
		await User.create({ 
			email, 
			password: hashedPassword, 
			avatarURL,
			verificationToken
		});

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
	
	try {
		const _id = req.user.id;

		await User.findByIdAndUpdate(_id, value, { new: true });

		return res.status(200).json({message: "Subscription Updated!"});
	} catch (e) {
		res.status(400).json(e.message);
	}
}

const uploadAvatar = async(req, res) => {
	try {
		const { _id } = req.user;
		
		if(!req.file) return res.status(400).json({ message: "No file uploaded" });

		const { path: oldPath, originalname } = req.file;


		await Jimp.read(oldPath).then(image => image.resize({ w: 250, h: 250 }).write(oldPath)).catch(e => e);
		
		const extension = path.extname(originalname);
		const filename = `${_id}${extension}`;
		
		const newPath = path.join("public", "avatar", filename)
		await fs.rename(oldPath, newPath);
		
		const avatarURL = path.join('/avatar', filename);

		await User.findByIdAndUpdate(_id, { avatarURL });

		res.status(200).json({ message: "Avatar updated!" })

	} catch (e) {
		res.status(400).json(e.message);
	}
}

const verifyUser = async(req, res) => {
	const { verificationToken } = req.params;
	try {
		const user = await User.findOne({ verificationToken });
		
		if (!user) return res.status(404).json({message: "User not found!"});

		await User.findByIdAndUpdate(user._id, {
			verify: true,
			verificationToken: null
		});

		res.status(200).json({message: "Verification Successful!"});

	} catch (e) {
		res.status(400).json(e.message);
	}
}

const resendVerification = async(req, res) => {
	const { error, value } = resValidator(req.body);

	if (error) return res.status(400).json({message: error.message});
	
	try {
		const { email } = value;
		const verificationToken = nanoid();

		await User.findOneAndUpdate({email}, { verificationToken });
		
		await sendEmail({
			to: email,
			subject: "Action Required: Verify Your Email",
			html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click to verify email</a>`
		});

		res.status(200).json({message: 'Verification token resended'});

	} catch (e) {
		res.status(400).json(e.message);
	}
}

export {
	signupUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	updateSubscription,
	uploadAvatar,
	verifyUser,
	resendVerification
};