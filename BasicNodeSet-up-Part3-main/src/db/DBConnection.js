/**
 * MongoDB Database Connection Module
 * Establishes connection to MongoDB database using Mongoose
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./.env" });

// ============ DATABASE CONFIGURATION ============
// Get MongoDB connection string from environment variables
let DBString = process.env.DBString;
console.log(DBString);

/**
 * Connect to MongoDB Database
 * 
 * This async function attempts to establish a connection to MongoDB
 * using the connection string from environment variables.
 * 
 * On Success: Logs confirmation and continues application
 * On Failure: Logs error and exits process with error code
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is established
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(DBString);
    console.log("DB Connected Successfully");
  } catch (error) {
    // Handle connection error
    console.error("Connection fail error ", error);
    // Exit process if connection fails
    process.exit(1);
  }
};

// Export the connection function
export default connectDB;
