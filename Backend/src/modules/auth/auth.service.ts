import bcrypt from "bcrypt";
import { genrateAccessToken,genrateRefreshToken  } from "../../utils/jwt.js";
import prisma from "../../config/db.js";

export const loginService = async (email: string, password: string) => {
  // Fetch user from database (replace with your actual database logic)
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Generate access and refresh tokens (implement your token generation logic)
  const accessToken = genrateAccessToken(user); // Implement this function
  const refreshToken = genrateRefreshToken(user); // Implement this function

  return { accessToken, refreshToken };
};

export const registerService = async (name: string, email: string, password: string) => {
  // Check if the user already exists in the database
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user in the database (replace with your actual database logic)
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  });

  // Generate access and refresh tokens (implement your token generation logic)
 // Implement this function

  return { userId: { id: newUser.id , name: newUser.name } };
}