/**
 * Standard API Response Class
 * Provides consistent response structure for successful API requests
 */

/**
 * ApiResponse Class
 * 
 * Standardizes API response format with status code, data, and message.
 * Success flag is automatically determined based on status code.
 * 
 * @class
 * 
 * @example
 * res.json(new ApiResponse(200, {user: userData}, "User retrieved successfully"))
 */
class ApiResponse {
  /**
   * Create an ApiResponse instance
   * 
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response data (can be any type - object, array, string, etc.)
   * @param {string} [message="Success"] - Response message describing the result
   */
  constructor(statusCode, data, message = "Success") {
    // ============ RESPONSE PROPERTIES ============
    // HTTP status code
    this.statusCode = statusCode;
    
    // Response data payload
    this.data = data;
    
    // Response message
    this.message = message;
    
    // Success indicator: true for 2xx-3xx status codes, false for 4xx-5xx
    this.success = statusCode < 400;
  }
}

export default ApiResponse;