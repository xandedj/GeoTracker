import { Request, Response } from "express";
import { storage } from "../storage";
import { loginSchema, registerSchema } from "@shared/schema";
import { hashPassword, comparePasswords } from "../utils/passwords";

// Register a new user
export async function register(req: Request, res: Response) {
  try {
    // Validate request data
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
    }

    const { email, password, fullName, phone } = result.data;

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await storage.createUser({
      email,
      hashedPassword,
      fullName,
      phone,
      role: "user",
    });

    // Remove password from response
    const { hashedPassword: _, ...userWithoutPassword } = user;

    // Set user in session
    if (req.session) {
      req.session.userId = user.id;
    }

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
}

// Log in a user
export async function login(req: Request, res: Response) {
  try {
    // Validate request data
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
    }

    const { email, password } = result.data;

    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await comparePasswords(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Remove password from response
    const { hashedPassword: _, ...userWithoutPassword } = user;

    // Set user in session
    if (req.session) {
      req.session.userId = user.id;
    }

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
}

// Log out a user
export async function logout(req: Request, res: Response) {
  try {
    // Destroy session
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ message: "An error occurred during logout" });
        }
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.status(200).json({ message: "Already logged out" });
    }
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
}

// Get the current user
export async function getCurrentUser(req: Request, res: Response) {
  try {
    // User should be available from the auth middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Remove password from response
    const { hashedPassword: _, ...userWithoutPassword } = req.user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ message: "An error occurred while getting user data" });
  }
}
