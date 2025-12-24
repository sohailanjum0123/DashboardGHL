import fs from "fs";
import csv from "csv-parser";
import { RowData } from "../models/rowData.js";
import { sanitizeRow } from "../utils/csvHelper.js";
import { uploadOnCloudinary } from "../Service/cloudinary.js";

export const uploadCsv = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;

  try {
    // 1. Upload CSV to Cloudinary
    const cloudinaryRes = await uploadOnCloudinary(filePath);
    if (!cloudinaryRes) {
      return res.status(500).json({ error: "CSV upload to Cloudinary failed" });
    }

    const BATCH_SIZE = 1000;
    let buffer = [];
    let inserted = 0;

    const readStream = fs
      .createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => header.trim() }));

    readStream.on("data", (row) => {
      buffer.push(sanitizeRow(row));
      if (buffer.length >= BATCH_SIZE) {
        readStream.pause();
        RowData.insertMany(buffer, { ordered: false })
          .then((docs) => {
            inserted += docs.length;
            buffer = [];
            readStream.resume();
          })
          .catch((err) => {
            console.error("Batch insert error:", err);
            buffer = [];
            readStream.resume();
          });
      }
    });

    readStream.on("end", async () => {
      try {
        if (buffer.length > 0) {
          const docs = await RowData.insertMany(buffer, { ordered: false });
          inserted += docs.length;
        }

        fs.unlink(filePath, () => {});

        res.json({
          success: true,
          inserted,
          fileUrl: cloudinaryRes.secure_url,
          publicId: cloudinaryRes.public_id,
        });
      } catch (err) {
        console.error("Final insert error:", err);
        res.status(500).json({ error: err.message });
      }
    });

    readStream.on("error", (err) => {
      console.error("CSV read error:", err);
      res.status(500).json({ error: err.message });
    });
  } catch (err) {
    console.error("Upload CSV controller error:", err);
    res.status(500).json({ error: err.message });
  }
};
