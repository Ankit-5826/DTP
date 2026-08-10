/**
 * Main Express Application Setup
 * Configures middleware, CORS, and routes for the Node.js server
 */

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthCheckRoute from "./routes/healthCheck.routes.js";
import authRoute from "./routes/auth.route.js";

// Initialize Express application
const app = express();

// ============ MIDDLEWARE CONFIGURATION ============

// Parse incoming JSON requests with 16kb size limit
app.use(express.json({ limit: "16kb" }));

// Parse incoming form-encoded requests with 16kb size limit
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from public directory
app.use(express.static("public"));

// Parse and handle cookies from requests
app.use(cookieParser());

// ============ CORS CONFIGURATION ============
// Configure Cross-Origin Resource Sharing to allow requests from specified origins
app.use(
  cors({
    // Allow requests from origin specified in .env or localhost:5173 as fallback
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    // Allow credentials (cookies, auth headers) to be sent
    credentials: true,
    // Allowed HTTP methods
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // Allowed request headers
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ============ BASIC ROUTES ============

// Root endpoint - simple greeting
app.get("/", (req, res) => {
  res.send("Hello ankit here");
});

// User endpoint - test endpoint
app.get("/User", (req, res) => {
  res.send("User is here");
});

// ============ API ROUTES ============

// Health check routes - used to verify server is running
app.use("/api/v1/healthCheck/", healthCheckRoute);

// Authentication routes - handles user registration, login, password reset, etc.
app.use("/api/v1/auth/", authRoute);

export default app;
