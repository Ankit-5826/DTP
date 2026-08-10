/**
 * Authentication Routes
 * Defines all user authentication endpoints (register, login, password management, etc.)
 */

import { Router } from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  getCurrentUser,
  resendVerifyEmail,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changeCurrentPassword,
} from "../controllers/auth.controller.js";
import {
  validateNewUserData,
  validateLogin,
} from "../validators/userValidator.validator.js";
import { validator } from "../middlewares/validator.middleware.js";
import { authRequest } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = Router();

// ============ USER REGISTRATION ROUTES ============

/**
 * POST /api/v1/auth/register
 * Register a new user account
 * Validates email, username, password, and full name
 * Sends email verification link
 */
router.route("/register").post(validateNewUserData(), validator, registerUser);

/**
 * GET /api/v1/auth/email-verify/:token
 * Verify user email with verification token sent to email
 * Marks email as verified in database
 */
router.route("/email-verify/:token").get(verifyEmail);

// ============ LOGIN & SESSION ROUTES ============

/**
 * POST /api/v1/auth/login
 * Authenticate user and create session
 * Returns access and refresh tokens via cookies
 * Validates email and password
 */
router.route("/login").post(validateLogin(), validator, loginUser);

/**
 * POST /api/v1/auth/logout
 * Logout user and invalidate tokens
 * Requires authentication
 */
router.route("/logout").post(authRequest, logoutUser);

/**
 * POST /api/v1/auth/current-user
 * Get currently authenticated user information
 * Requires authentication
 */
router.route("/current-user").post(authRequest, getCurrentUser);

// ============ EMAIL VERIFICATION ROUTES ============

/**
 * POST /api/v1/auth/resend-email-verify
 * Resend email verification link to unverified user
 * Requires authentication
 * Useful if user didn't receive original verification email
 */
router.route("/resend-email-verify").post(authRequest, resendVerifyEmail);

// ============ TOKEN MANAGEMENT ROUTES ============

/**
 * POST /api/v1/auth/access-token-refresh
 * Refresh access token using valid refresh token
 * Requires authentication
 * Returns new access and refresh tokens
 */
router.route("/access-token-refresh").post(authRequest, refreshAccessToken);

// ============ PASSWORD MANAGEMENT ROUTES ============

/**
 * POST /api/v1/auth/forgot-password
 * Request password reset
 * Sends password reset link to user's email
 * Does not require authentication
 */
router.route("/forgot-password").post(forgotPassword);

/**
 * POST /api/v1/auth/reset-password/:resetToken
 * Reset password using token from email
 * Requires reset token from forgot-password email
 * Does not require authentication
 */
router.route("/reset-password/:resetToken").post(resetPassword);

/**
 * POST /api/v1/auth/change-password
 * Change password for authenticated user
 * Requires current password and new password
 * Requires authentication
 */
router.route("/change-password").post(authRequest, changeCurrentPassword);

// Export router with authentication routes
export default router;
