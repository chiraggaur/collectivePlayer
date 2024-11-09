// Note

/*
Since both clients are interacting with the same database, you should only use one client at a time within specific parts of your code, depending on the feature.
Use Prisma for database-heavy services, like complex joins, relational queries, and type-safe CRUD operations.
Use Supabase for handling authentication, storage, and real-time updates, as well as providing quick REST API access where you don’t need Prisma’s depth.
*/

// supabaseClient.ts

import { AuthError, createClient, SupabaseClient } from "@supabase/supabase-js";
import { Session, User } from "@supabase/supabase-js";
import { Request, Response } from "express";

// Define the types for the response from Supabase auth methods
type AuthResponse<T> = T | { error: AuthError };

// Environment variables validation
const supabaseUrl: string = process.env.SUPABASE_URL || "";
const supabaseKey: string = process.env.SUPABASE_KEY || "";
const supabaseServiceRoleKey: string =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are missing.");
}

// Create and export the Supabase client
// const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Function to handle errors consistently
const handleAuthError = (error: AuthError): void => {
  console.error("Supabase Auth Error:", error.message);
};

// Function to verify the token
const verifyToken = async (token: string) => {
  try {
    // Decode and verify the token
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw new Error(error.message);

    return data.user; // Return the user object if verification is successful
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

// Sign-up function with Supabase
const signUp = async (
  email: string,
  password: string
): Promise<AuthResponse<{ user: User | null; session: Session | null }>> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    handleAuthError(error);
    return { error };
  }
  return data;
};

// Sign-in function with Supabase
const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse<{ user: User | null; session: Session | null }>> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    handleAuthError(error);
    return { error };
  }
  return data;
};

// Sign-out user
const signOut = async (req: Request, res: Response): Promise<void> => {
  const signOutResult = await supabase.auth.signOut();

  if (signOutResult.error) {
    console.error("Sign-out error:", signOutResult.error.message);
    res.status(400).json({ message: signOutResult.error.message });
    return;
  }

  res.status(200).json({ message: "Logged out successfully" });
};

// Delete User  Permanently

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body.userId;

  console.log(userId);

  const { data, error } = await supabase.auth.admin.deleteUser(String(userId));

  if (error) {
    console.error("Sign-out error:", error.message);
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(200).json({ message: "user Deleted Successfully" });
  return;
};

// Export supabase client and auth methods
export default supabase;
export { signIn, signUp, signOut, deleteUser, verifyToken };
