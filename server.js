import app from './app.js';
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST } = process.env;

mongoose
.connect(DB_HOST, {})
.then(() => {
	app.listen(3000, () => {
	  console.log("Server is running. Use our API on port: 3000");
	});
	console.log("Database connection is successful")
})
.catch((e) => {
	console.log(`Server is not running. Error Message ${e.message}`);
	process.exit(1);
})
