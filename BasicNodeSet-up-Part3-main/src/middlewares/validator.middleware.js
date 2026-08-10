/**
 * Request Data Validation Middleware
 * Processes and handles validation errors from express-validator
 */

import { validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

/**
 * Validation Error Handler Middleware
 * 
 * Checks for validation errors from express-validator rules applied to the request.
 * If validation errors exist, throws an ApiError with error details.
 * Otherwise, passes control to the next middleware/handler.
 * 
 * Usage: Apply after express-validator validation rules
 * Example: router.post("/register", validateNewUserData(), validator, registerUser)
 * 
 * @middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {ApiError} 422 - If validation errors are found
 */
const validator = (req, res, next) => {
  // ============ EXTRACT VALIDATION ERRORS ============
  // Get validation results from express-validator
  let errors = validationResult(req);

  // ============ CHECK IF NO ERRORS ============
  // If no validation errors, proceed to next middleware
  if (errors.isEmpty()) {
    return next();
  }

  // ============ FORMAT VALIDATION ERRORS ============
  // Convert validation errors to readable format
  const extractedErrors = [];
  errors.array().map((err) =>
    extractedErrors.push({
      [err.path]: err.msg,  // Field name as key, error message as value
    }),
  );
  
  // ============ THROW VALIDATION ERROR ============
  // Throw ApiError with HTTP 422 status (Unprocessable Entity)
  throw new ApiError(422, "Recieved data is not valid", extractedErrors);
};

// Export validator middleware
export { validator };
