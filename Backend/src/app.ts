import express from "express";
import authRoutes from "./modules/auth/auth.route.js";
import apiKeyRoutes from "./modules/api_key/apiKey.route.js";
import adminRoutes from "./modules/admin/admin.route.js";
import policyRoutes from "./modules/policy/policy.routes.js";
import limiterRoutes from "./modules/limiter/limiter.routes.js";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/apikey", apiKeyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/limiter", limiterRoutes);
app.use(errorHandler);

export default app;