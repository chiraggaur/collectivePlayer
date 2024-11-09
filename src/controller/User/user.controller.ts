import { Request, Response } from "express";
import prisma from "../../services/prismaClient";
import { signIn, signUp } from "../../services/supabaseClient";
import { UserData } from "./userController.Types";
import bcrypt from "bcrypt";

// Utility function to handle errors
const handleError = (res: Response, status: number, message: string): void => {
  res.status(status).json({ error: message });
};

// Function to create user in Prisma after Supabase sign-up
const createUserInPrisma = async (
  email: string,
  password: string,
  name: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
};

// Sign-up new user and return the token
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name }: UserData = req.body;

    // Check if the user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Attempt to sign up with Supabase
      const signUpResult = await signUp(email, password);

      if ("error" in signUpResult) {
        // If sign-up failed, return the error message
        return handleError(res, 400, signUpResult.error.message);
      }

      // If Supabase sign-up is successful, create user in Prisma
      user = await createUserInPrisma(email, password, name);

      const token = signUpResult?.session?.access_token;

      res.status(200).json({
        prismaUser: user,
        token, // Send token as part of the response
      });
      return;
    }

    // If user already exists
    return handleError(
      res,
      401,
      "You are already a registered user. Please sign in!"
    );
  } catch (error) {
    console.error("Error in /api/createUser:", error);
    return handleError(res, 500, "An error occurred while signing up the user");
  }
};

// Function to log in user by verifying email and password
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: UserData = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return handleError(res, 401, "Authorization token missing");
    }

    // Attempt to log the user in with Supabase credentials
    const loggedInUserResponse = await signIn(email, password);

    if ("error" in loggedInUserResponse) {
      return handleError(
        res,
        400,
        "Wrong Id or password , Error while logging you in ."
      );
    }

    // Return logged-in user's information
    res.status(200).json({ user: loggedInUserResponse.user });
    return;
  } catch (error) {
    console.error("Error in /api/getUser:", error);
    return handleError(res, 500, "An error occurred while retrieving the user");
  }
};
