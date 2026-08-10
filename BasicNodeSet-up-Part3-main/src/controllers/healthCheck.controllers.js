/**
 * Health Check Controller
 * Handles server health status endpoint
 */

import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/async-handler.js";

/**
 * Health Check Handler
 * 
 * Responds to health check requests to verify server is running and responsive.
 * Returns a standardized success response indicating server status.
 * 
 * This endpoint can be used by:
 * - Load balancers to check server availability
 * - Monitoring services to verify uptime
 * - Frontend to verify API connectivity
 * 
 * @async
 * @function healthCheck
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status 200 and message
 * 
 * @example
 * GET /api/v1/healthCheck/
 * Response: {"statusCode": 200, "data": {"messgae": "Server is running"}, "message": "Success", "success": true}
 */
const healthCheck = asyncHandler(async (req, res) => {
  // Send 200 OK response with server running status
  res.status(200).json(new ApiResponse(200, { messgae: "Server is running" }));
});

// Export health check handler
export { healthCheck };
