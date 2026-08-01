import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// Pass the adapter instance to PrismaClient
const prisma = new PrismaClient({ adapter });

if(!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set."); 
}
if(!process.env.PORT) {
  throw new Error("PORT environment variable is not set."); 
}


export default prisma;
