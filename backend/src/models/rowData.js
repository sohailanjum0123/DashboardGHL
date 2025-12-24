import mongoose, { Schema } from "mongoose";

const RowDataSchema = new Schema(
  {},
  { strict: false, timestamps: true }
);



export const RowData = mongoose.model("RowData", RowDataSchema);
