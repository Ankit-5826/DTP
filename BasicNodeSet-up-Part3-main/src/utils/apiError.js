/**
 * Custom API Error Class
 * Extends Error to provide consistent error handling across the application
 */

/**
 * ApiError Class
 * 
 * Custom error class for API error responses.
 * Provides standardized error object with status code, message, and additional error details.
 * 
 * @class
 * @extends Error
 * 
 * @example
 * throw new ApiError(400, "Invalid email format", [{email: "Email is invalid"}])
 */
class ApiError extends Error {
  /**
   * Create an ApiError instance
   * 
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
   * @param {string} [message="Something went wrong"] - Error message to display to user
   * @param {Array} [errors=[]] - Array of detailed error objects for debugging
   * @param {string} [stack=""] - Error stack trace for logging purposes
   */
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
  ) {
    // Call parent Error constructor with message
    super(message);
    
    // ============ ERROR PROPERTIES ============
    // HTTP status code for the error response
    this.statusCode = statusCode;
    
    // Additional data associated with error (default: null)
    this.data = null;
    
    // Error message
    this.message = message;
    
    // Success flag - always false for errors
    this.success = false;
    
    // Array of detailed error objects (useful for validation errors)
    this.errors = errors;
  }
}

export default ApiError;