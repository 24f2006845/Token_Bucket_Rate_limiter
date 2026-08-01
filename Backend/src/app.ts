import express from "express";
import authRoutes from "./modules/auth/auth.route.js";

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use("/api/auth", authRoutes);

export default app;