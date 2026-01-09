import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import errorHandler from "./utils/cast_validate_duplicate_Error.js";


const app = express();


app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin: "http://localhost:4002",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(express.json());

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(errorHandler)


import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js"
import rowDataRoutes from "./routes/rowDataRoutes.js";


app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use('/api/csv', rowDataRoutes);

export {app}