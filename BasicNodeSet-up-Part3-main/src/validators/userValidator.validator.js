/**
 * User Data Validation Rules
 * Defines express-validator validation chains for user registration and login
 */

import { body } from "express-validator";

/**
 * Validate New User Registration Data
 * 
 * Validation rules for user registration:
 * - Email: Required, must be valid email format
 * - Username: Required, minimum 3 characters
 * - Password: Required
 * - Full Name: Required, minimum 3 characters
 * 
 * @function validateNewUserData
 * @returns {Array<Function>} Array of express-validator validation chains
 * 
 * @example
 * // Apply in route
 * router.post("/register", validateNewUserData(), validator, registerUser);
 */
const validateNewUserData = function () {
  return [
    // ============ EMAIL VALIDATION ============
    body("email")
      .trim()                                    // Remove whitespace
      .notEmpty()
      .withMessage("Email is required")          // Required check
      .isEmail()
      .withMessage("Email is invalid"),         // Email format check
    
    // ============ USERNAME VALIDATION ============
    body("username")
      .trim()                                    // Remove whitespace
      .notEmpty()
      .withMessage("Username is required")       // Required check
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"), // Length check
    
    // ============ PASSWORD VALIDATION ============
    body("password")
      .trim()                                    // Remove whitespace
      .notEmpty()
      .withMessage("Password is required"),     // Required check
    
    // ============ FULL NAME VALIDATION ============
    body("fullname")
      .trim()                                    // Remove whitespace
      .notEmpty()
      .withMessage("Full name is required")      // Required check
      .isLength({ min: 3 })
      .withMessage("Full name must be at least 3 characters long"), // Length check
  ];
};

/**
 * Validate User Login Data
 * 
 * Validation rules for user login:
 * - Email: Required, must be valid email format
 * - Password: Required
 * 
 * @function validateLogin
 * @returns {Array<Function>} Array of express-validator validation chains
 * 
 * @example
 * // Apply in route
 * router.post("/login", validateLogin(), validator, loginUser);
 */
const validateLogin = function () {
  return [
    // ============ EMAIL VALIDATION ============
    body("email")
      .trim()                                    // Remove whitespace
      .notEmpty()
      .withMessage("Email is required")          // Required check
      .isEmail()
      .withMessage("Email is invalid"),         // Email format check
    
    // ============ PASSWORD VALIDATION ============
    body("password")
      .notEmpty()
      .withMessage("Password is required"),     // Required check
  ];
};

// Export validation functions
export { validateNewUserData, validateLogin };
