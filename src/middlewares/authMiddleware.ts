import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/supabaseClient";

// Middleware to authenticate user based on Supabase token
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Token is missing" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const user = await verifyToken(token);

    if (!user) {
      res.status(403).json({ error: "Forbidden: Invalid or expired token" });
      return;
    }

    // Attach the user object to the request
    req.body = user;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
