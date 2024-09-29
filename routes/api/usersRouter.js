import express from "express";
import { 
	signupUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	updateSubscription,
	uploadAvatar,
	verifyUser,
	resendVerification
} from "../../controllers/userControllers.js";

import { authToken } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";

export const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/logout', authToken, logoutUser);
router.get('/current', authToken, getCurrentUser);
router.patch('/', authToken, updateSubscription);
router.patch('/avatars', authToken, upload.single('avatar'), uploadAvatar);
router.get('/verify/:verificationToken', verifyUser);
router.post('/verify', resendVerification);