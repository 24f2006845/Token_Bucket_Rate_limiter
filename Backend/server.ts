import "dotenv/config";
import app from "./src/app.js";
import prisma from "./src/config/db.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();