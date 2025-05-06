import * as crypto from "crypto";
import { promisify } from "util";

// Promisify crypto functions
const randomBytes = promisify(crypto.randomBytes);
const pbkdf2 = promisify(crypto.pbkdf2);

// Configuration
const SALT_LEN = 16;
const KEY_LEN = 64;
const ITERATIONS = 10000;
const DIGEST = "sha512";

/**
 * Hash a password using PBKDF2
 * 
 * @param password The plain text password to hash
 * @returns The hashed password string in the format `iterations:salt:hash`
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate random salt
  const salt = await randomBytes(SALT_LEN);
  
  // Hash the password
  const hash = await pbkdf2(
    password,
    salt,
    ITERATIONS,
    KEY_LEN,
    DIGEST
  );
  
  // Format: iterations:salt:hash
  return `${ITERATIONS}:${salt.toString("hex")}:${hash.toString("hex")}`;
}

/**
 * Verify a password against a stored hash
 * 
 * @param password The plain text password to verify
 * @param storedHash The stored hash to verify against
 * @returns True if the password matches, false otherwise
 */
export async function comparePasswords(password: string, storedHash: string): Promise<boolean> {
  try {
    // Parse the stored hash
    const [iterations, salt, hash] = storedHash.split(":");
    const iterCount = parseInt(iterations);
    
    // Hash the input password with the same salt and iterations
    const hashBuffer = await pbkdf2(
      password,
      Buffer.from(salt, "hex"),
      iterCount,
      KEY_LEN,
      DIGEST
    );
    
    // Compare the hashes
    const hashHex = hashBuffer.toString("hex");
    return hashHex === hash;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}
