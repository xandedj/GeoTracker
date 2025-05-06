import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

// Extend the Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Check if user is authenticated via session
    const userId = req.session?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Get user from storage
    const user = await storage.getUserById(userId);
    
    if (!user) {
      // If user not found but we have userId in session, clear session
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
      });
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request object for later use
    req.user = user;
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "An error occurred during authentication" });
  }
}
