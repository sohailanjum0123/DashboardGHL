import multer from "multer";
import path from "path";  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
})

export const upload = multer({
    storage: storage
})


// File filter to allow only CSV
function csvFileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const isCsv = file.mimetype === "text/csv" || ext === ".csv";

  if (isCsv) {
    cb(null, true);
  } else {
    cb(null, false); // silently reject non-csv
    // OR you can pass an error: cb(new Error("Only CSV files are allowed"));
  }
}

// Multer upload instance
export const csvUpload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // optional: 50MB
  fileFilter: csvFileFilter,
});


