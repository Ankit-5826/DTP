// ============ IMPORTS ============
// Import mongoose and Schema constructor for defining MongoDB schema
import mongoose, { Schema } from "mongoose";

// JWT is used to generate access and refresh tokens
import jwt from "jsonwebtoken";

// bcrypt is used for hashing and comparing passwords securely
import bcrypt from "bcrypt";

// crypto is used for generating cryptographically secure random tokens
import crypto from "crypto";

/**
 * User Schema
 * Defines the structure of the user document in MongoDB
 * Includes fields for authentication, profile, and token management
 */
const UserSchema = new Schema(
  {
    // ============ PROFILE INFORMATION ============
    
    // User profile photo information
    userphoto: {
      type: {
        url: String, // URL of profile image
        localPath: String, // Local file path (if stored on server)
      },
      default: {
        url: "https://fastly.picsum.photos/id/24/200/200.jpg?hmac=Tw5b43UPAehS5e4JyB0qMQysvfLBmu_GZ_iafWou3m8",
        localPath: "",
      },
    },

    // ============ AUTHENTICATION CREDENTIALS ============
    
    // Username must be unique and stored in lowercase
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Email must be unique and stored in lowercase
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Full name of the user
    fullname: {
      type: String,
      trim: true,
    },

    // Hashed password (never stored in plain text)
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // ============ EMAIL VERIFICATION ============
    
    // Email verification status
    isEmailVarified: {
      type: Boolean,
      default: false,
    },

    // ============ SESSION TOKENS ============
    
    // Access token for maintaining user sessions (short-lived)
    accessToken: {
      type: String,
    },

    // Refresh token for maintaining user sessions (long-lived)
    refreshToken: {
      type: String,
    },

    // ============ PASSWORD RESET TOKENS ============
    
    // Token used for password reset
    forgotPassToken: {
      type: String,
    },

    // Expiry time for password reset token
    forgotPassTokenExpiry: {
      type: String, // ⚠️ Better to use Date type
    },

    // ============ EMAIL VERIFICATION TOKENS ============
    
    // Token used for email verification
    emailVarifiationToken: {
      type: String,
    },

    // Expiry time for email verification token
    emailVarifiationTokenExpiry: {
      type: String, // ⚠️ Better to use Date type
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// ============ MONGOOSE HOOKS & METHODS ============

/**
 * Pre-save Hook
 * Automatically called before saving a user document
 * Hashes the password using bcrypt if password field is modified
 * Only rehashes if password was changed (not on every save)
 */
UserSchema.pre("save", async function () {
  // Skip hashing if password wasn't modified
  if (!this.isModified("password")) return;
  // Hash password with salt rounds of 10
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compare Password Method
 * Instance method to verify if provided password matches hashed password
 * Used during user login for authentication
 * 
 * @param {string} password - Plain text password to compare
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
UserSchema.methods.isSamePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Generate Access Token
 * Instance method to create JWT access token for user
 * Short-lived token (typically 15 minutes) used for API authentication
 * Contains user ID, username, and email
 * 
 * @returns {string} Signed JWT access token
 */
UserSchema.methods.generateAccessToken = function () {
  const accessTokenData = {
    _id: this._id,
    username: this.username,
    email: this.email,
  };
  console.log("22222");
  return jwt.sign(accessTokenData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
  });
};

/**
 * Generate Refresh Token
 * Instance method to create JWT refresh token for user
 * Long-lived token (typically 7 days) used to issue new access tokens
 * Contains only user ID for minimal data exposure
 * 
 * @returns {string} Signed JWT refresh token
 */
UserSchema.methods.generateRefreshToken = function () {
  const refreshTokenData = {
    _id: this._id,
  };

  return jwt.sign(refreshTokenData, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN,
  });
};

/**
 * Generate Temporary Access Token
 * Instance method to create temporary token for email verification or password reset
 * Token is sent to user's email and expires after 20 minutes
 * 
 * Uses a 2-step process for security:
 * 1. Generate random token sent to user
 * 2. Hash token before storing in database (prevents exposure if DB is compromised)
 * 
 * @returns {Object} Object containing:
 *   - tempToken: Plain text token to send to user (via email)
 *   - tempTokenHash: Hashed token to store in database
 *   - tempTokenExpiresDate: Timestamp when token expires
 */
UserSchema.methods.generateTempAccessToken = function () {
  // ============ GENERATE RANDOM TOKEN ============
  // Generate secure random token using crypto (plain text for user)
  const tempToken = crypto.randomBytes(32).toString("hex");

  // ============ HASH TOKEN FOR STORAGE ============
  // Hash token before storing in DB (security best practice)
  // If DB is compromised, hashed tokens won't expose the actual tokens
  const tempTokenHash = crypto
    .createHash("sha256")
    .update(tempToken)
    .digest("hex");

  // ============ SET EXPIRY TIME ============
  // Token expiry time (20 minutes from now)
  const tempTokenExpiresDate = Date.now() + 1000 * 20 * 60;
  console.log("---->", tempToken, tempTokenHash, tempTokenExpiresDate);
  return { tempToken, tempTokenHash, tempTokenExpiresDate };
};

// ============ MODEL CREATION & EXPORT ============

// Create User model from schema
const User = mongoose.model("User", UserSchema);

// Export User model for use in other files
export { User };
