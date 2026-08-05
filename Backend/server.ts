import "dotenv/config";
import app from "./src/app.js";
import prisma from "./src/config/db.js";
import redisClient from "./src/config/redis.js";
import redis from "./src/config/redis.js";



const startServer = async () => {
  try {
    await prisma.$connect();
    await redisClient.connect();
    console.log("✅ Database connected");
    console.log("✅ Redis connected");
    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();