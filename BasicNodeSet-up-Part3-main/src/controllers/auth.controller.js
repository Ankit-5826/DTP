/**
 * Authentication Controller
 * Handles all authentication-related operations including registration, login, password management
 */

import { User } from "../models/users.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/async-handler.js";
import sendEmail from "../utils/sendMail.js";
import {
  getVerifyEmailContant,
  getForgotPasswordEmailContant,
} from "../utils/emailContantGenerator.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Generate Access and Refresh Tokens
 * 
 * Creates JWT tokens for authenticated users and stores them in database
 * 
 * @async
 * @function generateAccessAndRefreshTokens
 * @param {string} userId - MongoDB user ID
 * @returns {Object} Object containing accessToken and refreshToken
 * @throws {ApiError} 500 - If token generation fails
 */
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // Fetch user from database
    const user = await User.findById(userId);
    // Generate short-lived access token
    const accessToken = user.generateAccessToken();
    // Generate long-lived refresh token
    const refreshToken = user.generateRefreshToken();
    // Store tokens in user document
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    // Save tokens to database without validation
    await user.save({ validateBeforeSave: false });
    // Return both tokens
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

/**
 * Register User
 * 
 * Creates a new user account and sends email verification link
 * 
 * @async
 * @function registerUser
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User email
 * @param {string} req.body.username - User username
 * @param {string} req.body.password - User password
 * @param {string} req.body.fullname - User full name
 * @param {Object} res - Express response object
 * @returns {Object} Created user details (without password) and verification email sent confirmation
 * @throws {ApiError} 409 - If user with email or username already exists
 * @throws {ApiError} 500 - If user creation fails
 */
const registerUser = asyncHandler(async (req, res) => {
  // Extract user data from request body
  const { email, username, password, fullname } = req.body;

  // Check if user with same email or username already exists
  const userAlreadyThere = await User.findOne({ $or: [{ username, email }] });
  if (userAlreadyThere) {
    throw new ApiError(409, "User with email or username already exists", []);
  }

  // Create new user in database
  const user = await User.create({
    email,
    username,
    password,
    fullname,
    isEmailVarified: false, // Email not verified yet
  });

  // Generate temporary email verification token
  const { tempToken, tempTokenHash, tempTokenExpiresDate } =
    user.generateTempAccessToken();

  // Store hashed verification token and expiry time in database
  user.emailVarifiationToken = tempTokenHash;
  user.emailVarifiationTokenExpiry = tempTokenExpiresDate;


  // Save user with verification token to database
  await user.save({ validateBeforeSave: false });

  // Generate email content for verification
  const emailData = getVerifyEmailContant(
    username,
    `${req.protocol}://${req.get("host")}/api/v1/auth/email-verify/${tempToken}`,
  );

  // Send verification email to user
  await sendEmail(email, emailData);

  // Fetch created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  // Verify user was created successfully
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  // Return success response with created user
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "Verification email has been sent on your email again",
      ),
    );
});

/**
 * Verify Email
 * 
 * Verifies user email using token sent to their email address
 * Marks email as verified in database after successful verification
 * 
 * @async
 * @function verifyEmail
 * @param {Object} req - Express request object
 * @param {string} req.params.token - Email verification token from email link
 * @param {Object} res - Express response object
 * @returns {Object} Email verification confirmation
 * @throws {ApiError} 400 - If token is missing or invalid
 * @throws {ApiError} 400 - If token has expired
 */
const verifyEmail = asyncHandler(async (req, res) => {
  // Extract verification token from URL parameter
  const { token } = req.params;

  // Check if token is provided
  if (!token) {
    throw new ApiError(400, "Email verification token is missing");
  }

  // Hash the token to match database format
  const tempTokenHash = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Find user with matching token and check expiry
  const user = await User.findOne({
    emailVarifiationToken: tempTokenHash,
    emailVarifiationTokenExpiry: { $gt: Date.now() }, // Token must not be expired
  });

  // Check if user found and token valid
  if (!user) {
    throw new ApiError(400, "Token is invalid or expired");
  }

  // ============ EMAIL VERIFICATION SUCCESS ============
  // Clear verification token and expiry from database
  user.emailVarifiationToken = undefined;
  user.emailVarifiationTokenExpiry = undefined;

  // Mark email as verified
  user.isEmailVarified = true;

  // Save verification status to database
  await user.save({ validateBeforeSave: false });

  // Return success response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isEmailVerified: true,
      },
      "Email is verified",
    ),
  );
});

/**
 * Login User
 * 
 * Authenticates user with email and password
 * Returns access and refresh tokens if credentials are valid
 * 
 * @async
 * @function loginUser
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @param {Object} res - Express response object
 * @returns {Object} User info with access and refresh tokens
 * @throws {ApiError} 400 - If email or password is missing
 * @throws {ApiError} 400 - If user not found
 * @throws {ApiError} 400 - If password is incorrect
 */
const loginUser = asyncHandler(async (req, res) => {
  // Extract credentials from request body
  const { email, password } = req.body;

  // Validate email
  if (!email) {
    throw new ApiError(400, "Email is not there");
  } else if (!password) {
    throw new ApiError(400, "password is not there");
  }

  // Find user by email
  let user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    throw new ApiError(400, "User is there, Please sign-up first");
  }

  // Verify password
  if (!(await user.isSamePassword(password))) {
    throw new ApiError(400, "Email and password is not correct");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  // Set cookie options
  const options = {
    httpOnly: true, // Prevent client-side JavaScript access
    secure: true,   // Send only over HTTPS
  };

  // Return success response with tokens in cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          email: user.email,
          username: user.username,
          accessToken,
          refreshToken,
        },
        "login done",
      ),
    );
});

/**
 * Logout User
 * 
 * Invalidates user tokens and clears authentication cookies
 * 
 * @async
 * @function logoutUser
 * @param {Object} req - Express request object (user attached by authRequest middleware)
 * @param {Object} res - Express response object
 * @returns {Object} Logout confirmation
 */
const logoutUser = asyncHandler(async (req, res) => {
  // Get authenticated user from request
  const user = req.user;

  // Clear refresh token from database
  let updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true, // Return updated user
    },
  );

  // Set cookie options
  let options = {
    httpOnly: true, // Prevent client-side JavaScript access
    secure: true,   // Send only over HTTPS
  };

  // Return success response with cleared cookies
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {
          email: updatedUser.email,
          username: updatedUser.username,
          accessToken: "",
          refreshToken: "",
        },
        "Logout done",
      ),
    );
});

/**
 * Get Current User
 * 
 * Returns authenticated user's information
 * 
 * @async
 * @function getCurrentUser
 * @param {Object} req - Express request object (user attached by authRequest middleware)
 * @param {Object} res - Express response object
 * @returns {Object} Current user information
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  // Return authenticated user attached to request
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fatch successful"));
});

/**
 * Resend Verification Email
 * 
 * Resends email verification link to unverified user
 * Generates new token and sends new verification email
 * 
 * @async
 * @function resendVerifyEmail
 * @param {Object} req - Express request object (user attached by authRequest middleware)
 * @param {Object} res - Express response object
 * @returns {Object} Confirmation that email has been sent
 * @throws {ApiError} 404 - If user not found
 * @throws {ApiError} 409 - If email is already verified
 */
const resendVerifyEmail = asyncHandler(async (req, res) => {
  // Fetch current user from database
  let user = await User.findById(req.user._id);

  // Check if user exists
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Check if email already verified
  if (user.isEmailVarified) {
    throw new ApiError(409, "Email is already verified");
  }

  // Generate new verification token
  const { tempToken, tempTokenHash, tempTokenExpiresDate } =
    user.generateTempAccessToken();

  // Store new token in database
  user.emailVarifiationToken = tempTokenHash;
  user.emailVarifiationTokenExpiry = tempTokenExpiresDate;

  // Save token to database
  await user.save({ validateBeforeSave: false });

  // Generate email content
  const emailData = getVerifyEmailContant(
    user.username,
    `${req.protocol}://${req.get("host")}/api/v1/auth/email-verify/${tempToken}`,
  );

  // Send verification email
  await sendEmail(user.email, emailData);

  // Return success response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mail has been sent to your email ID"));
});

/**
 * Refresh Access Token
 * 
 * Issues new access token using valid refresh token
 * 
 * @async
 * @function refreshAccessToken
 * @param {Object} req - Express request object (user attached by authRequest middleware)
 * @param {Object} res - Express response object
 * @returns {Object} New access and refresh tokens
 * @throws {ApiError} 400 - If refresh token is missing or invalid
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Extract refresh token from cookies or header
  const clientRefreshToken =
    req.cookies.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  // Check if refresh token provided
  if (!clientRefreshToken) {
    throw new ApiError(400, "Authorization access token");
  }

  // Verify refresh token
  const clientRefreshTokenData = jwt.verify(
    clientRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  // Find user by ID from token
  let user = await User.findById(clientRefreshTokenData?._id);

  // Check if user exists
  if (!user) {
    throw new ApiError(400, "Authorization access token");
  }

  // Verify token matches database
  if (clientRefreshToken !== user.refreshToken) {
    throw new ApiError(400, "Authorization access token2");
  }

  // Set cookie options
  const options = {
    httpOnly: true, // Prevent client-side JavaScript access
    secure: true,   // Send only over HTTPS
  };

  // Generate new tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  // Return new tokens
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "Access token refresh have been done",
      ),
    );
});

/**
 * Forgot Password
 * 
 * Initiates password reset process by sending reset link to user's email
 * 
 * @async
 * @function forgotPassword
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User email
 * @param {Object} res - Express response object
 * @returns {Object} Confirmation that reset link has been sent
 * @throws {ApiError} 404 - If user not found
 */
const forgotPassword = asyncHandler(async (req, res) => {
  // Extract email from request body
  const { email } = req.body;

  // Find user by email
  let user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    throw new ApiError("404", "User not fount, check your email");
  }

  // Generate password reset token
  const { tempToken, tempTokenHash, tempTokenExpiresDate } =
    user.generateTempAccessToken();

  // Store reset token in database
  user.forgotPassToken = tempTokenHash;
  user.forgotPassTokenExpiry = tempTokenExpiresDate;

  // Save token to database
  user.save({ validateBeforeSave: false });

  // Generate reset URL
  const url = `${req.protocol}://${req.get("host")}/api/v1/temp/change-password/${tempToken}`;

  // Generate email content
  const emailData = getForgotPasswordEmailContant(user.username, url);

  // Send reset email
  await sendEmail(email, emailData);

  // Return success response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email },
        "Forgot passeord link has been be sent to your email",
      ),
    );
});

/**
 * Reset Password
 * 
 * Resets user password using token from forgot password email
 * 
 * @async
 * @function resetPassword
 * @param {Object} req - Express request object
 * @param {string} req.params.resetToken - Password reset token
 * @param {string} req.body.newPassword - New password
 * @param {Object} res - Express response object
 * @returns {Object} User info with confirmation of password change
 * @throws {ApiError} 400 - If token or password is missing
 * @throws {ApiError} 404 - If token is invalid or expired
 */
const resetPassword = asyncHandler(async (req, res) => {
  // Extract reset token and new password
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  // Validate inputs
  if (!resetToken) {
    throw new ApiError(400, "Token is missing");
  } else if (!newPassword || newPassword.trim() === "") {
    throw new ApiError(400, "New Password is missing");
  }

  // Hash token to match database format
  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log("---> ", hashToken);

  // Find user with valid reset token
  const user = await User.findOne({
    forgotPassToken: hashToken,
    forgotPassTokenExpiry: { $gt: Date.now() }, // Token must not be expired
  });

  // Check if user found and token valid
  if (!user) {
    throw new ApiError(404, "Token is invalid or expired");
  }

  // Update password
  user.password = newPassword;
  // Clear verification tokens
  user.emailVarifiationToken = undefined;
  user.emailVarifiationTokenExpiry = undefined;

  // Save new password to database
  await user.save();

  // Return success response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: user.email,
        username: user.username,
      },
      "Password has been changed",
    ),
  );
});

/**
 * Change Current Password
 * 
 * Changes password for authenticated user
 * Verifies old password before allowing change
 * 
 * @async
 * @function changeCurrentPassword
 * @param {Object} req - Express request object (user attached by authRequest middleware)
 * @param {string} req.body.oldPassword - Current password
 * @param {string} req.body.newPassword - New password
 * @param {Object} res - Express response object
 * @returns {Object} User info with confirmation of password change
 * @throws {ApiError} 404 - If user not found
 * @throws {ApiError} 400 - If old password is incorrect
 */
const changeCurrentPassword = asyncHandler(async (req, res) => {
  // Extract passwords from request body
  const { oldPassword, newPassword } = req.body;

  // Find user by ID
  const user = await User.findById(req.user?._id);

  // Check if user exists
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Verify current password
  const isOldPasswordSame = await user.isSamePassword(oldPassword);

  // Check password match
  if (!isOldPasswordSame) {
    throw new ApiError(400, "Current password is not valid");
  }

  // Update to new password
  user.password = newPassword;

  // Save new password to database
  await user.save();

  // Return success response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: user.email,
        username: user.username,
      },
      "Password has been changed",
    ),
  );
});

export {
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
};
