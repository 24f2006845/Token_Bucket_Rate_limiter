import express from "express";
import authRoutes from "./modules/auth/auth.route.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;