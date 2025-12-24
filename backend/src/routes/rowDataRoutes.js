import { Router } from "express";
import { csvUpload } from "../middlewares/multerMiddleware.js";
import { uploadCsv } from "../controllers/rowDataController.js";

const router = Router();

// Upload CSV → Cloudinary → Parse → Insert DB
router.post("/upload-csv", csvUpload.single("file"), uploadCsv);

export default router;
