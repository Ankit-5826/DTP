/**
 * Authentication Middleware
 * Verifies JWT tokens and authenticates user requests
 */

import { User } from "../models/users.model.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

/**
 * Authentication Request Middleware
 * 
 * Validates JWT access tokens and attaches authenticated user to request object.
 * Tokens can be provided via:
 * - Cookie: accessToken cookie
 * - Header: Authorization header with "Bearer <token>" format
 * 
 * @async
 * @middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {ApiError} 401 - If token is missing or invalid
 * @throws {ApiError} 401 - If token has been invalidated
 */
const authRequest = asyncHandler(async (req, res, next) => {
  // ============ TOKEN EXTRACTION ============
  // Try to get token from cookies first, then from Authorization header
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  // ============ TOKEN VALIDATION ============
  // Check if token exists
  if (!token) {
    throw new ApiError(401, "Unauthorized request", []);
  }

  // ============ TOKEN VERIFICATION ============
  // Verify token signature using secret key
  const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // ============ USER LOOKUP ============
  // Retrieve user from database using token's user ID
  let user = await User.findById(tokenData?._id);

  // Check if user exists
  if (!user) {
    throw new ApiError(401, "Invalid access token", []);
  }

  // ============ TOKEN MATCHING ============
  // Ensure token matches the one stored in database (prevents token reuse after logout)
  if (token !== user.accessToken) {
    throw new ApiError(401, "Invalid access token login again");
  }

  // ============ ATTACH USER TO REQUEST ============
  // Attach authenticated user object to request for use in route handlers
  req.user = user;
  
  // Pass control to next middleware/route handler
  next();
});

// Export authentication middleware
export { authRequest };
