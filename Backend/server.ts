import "dotenv/config";
import app from "./src/app.js";
import prisma from "./src/config/db.js";
import redisClient from "./src/config/redis.js";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port");
}


const startServer = async () => {
  try {
    await prisma.$connect();
    await redisClient.connect();
    console.log("✅ Database connected");
    console.log("✅ Redis connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();
