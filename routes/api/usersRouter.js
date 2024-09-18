import express from "express";
import { 
	signupUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	updateSubscription
} from "../../controllers/userControllers.js";

import { authToken } from "../../middleware/auth.js";

export const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/logout', authToken, logoutUser);
router.get('/current', authToken, getCurrentUser);
router.patch('/', authToken, updateSubscription);