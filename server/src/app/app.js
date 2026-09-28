import express from "express";
import authRoutes from "../routes/auth.routes.js";
import productRoutes from "../routes/product.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5500",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;