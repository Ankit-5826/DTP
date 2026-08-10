/**
 * Application Entry Point
 * Initializes environment variables, connects to database, and starts the server
 */

import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/DBConnection.js";
import sendEmail from "./utils/sendMail.js";
import { getVerifyEmailContant } from "./utils/emailContantGenerator.js";

// ============ ENVIRONMENT CONFIGURATION ============
// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// ============ SERVER CONFIGURATION ============
// Get port from environment variable or use default port 3000
const PORT = process.env.PORT || 3000;

// ============ DATABASE & SERVER INITIALIZATION ============
/**
 * Connect to MongoDB database and start Express server
 * - Connects to database using connection string from .env
 * - Starts server on specified port if connection is successful
 * - Exits process if connection fails
 */
connectDB()
  .then(() => {
    // Database connected successfully - start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // Database connection failed
    console.log(`Error in db `, error);
    // Exit process with error code
    process.exit(1);
  });
