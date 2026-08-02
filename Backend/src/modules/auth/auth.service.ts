import bcrypt from "bcrypt";
import { genrateAccessToken,genrateRefreshToken, verifyRefreshToken  } from "../../utils/jwt.js";
import prisma from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";

export const loginService = async (email: string, password: string) => {
  
  try{

    const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError("User not found please register first", 404);
  }
  if (!user.password) {
    throw new AppError("User does not have a password set", 400);
  }


  const payload = {
    id : user.id,
    role : user.role
  };

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid password", 400);
  }

  
  const accessToken = genrateAccessToken(payload); 
  const refreshToken = genrateRefreshToken(payload); 

  const refreshTokenStored  = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  const data = {
    accessToken,
    refreshToken,
    user :{
      id : user.id,
      name : user.name,
      role : user.role
    },
  };
  return data;
    
  }catch(error){
    if (error instanceof AppError) {
      throw error; // Re-throw the AppError to be handled by the error handler middleware
    }
    throw new AppError("Internal server error", 500);
  }
};

export const registerService = async (name: string, email: string, password: string) => {
  // Check if the user already exists in the database
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user in the database (replace with your actual database logic)
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  });
  return { userId: { id: newUser.id , name: newUser.name } };
}
export const LogoutService = async (userId: string) =>{
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }


  return { message: "Logout successful" };

} 
export const getMeService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const refreshTokenService  = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    throw new AppError("Invalid refresh token", 401);
  }
  
  const userId = decoded.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.refreshToken !== refreshToken) {
    throw new AppError("Refresh token does not match", 401);
  }

  const payload = {
    id : user.id,
    role : user.role
  };
  const accessToken = genrateAccessToken(payload);

  return {
    accessToken,
    user :{
      id : user.id,
      name : user.name,
      role : user.role
    },
  };

}