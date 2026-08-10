/**
 * Health Check Routes
 * Defines endpoints for checking server health and connectivity
 */

import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck.controllers.js";

// Initialize Express router
const router = Router();

// ============ HEALTH CHECK ENDPOINTS ============

/**
 * GET /api/v1/healthCheck/
 * Returns server status and confirms server is running
 */
router.route("/").get(healthCheck);

/**
 * POST /api/v1/healthCheck/testt
 * Test endpoint - can be used for testing POST requests
 */
router.route("/testt").post(healthCheck);

// Export router with health check routes
export default router;
