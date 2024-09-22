import multer from "multer";
import path from "path";

const tempPath = path.join("temp");

const multerConfig = multer.diskStorage({
	destination: tempPath,
	filename: (_req, filename, cb) => {
		cb(null, filename.originalname);
	}
});

export const upload = multer({ storage: multerConfig });