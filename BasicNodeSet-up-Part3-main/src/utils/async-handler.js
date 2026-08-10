/**
 * Async Request Handler Wrapper
 * Handles promises and catches errors in async route handlers
 */

/**
 * asyncHandler Higher-Order Function
 * 
 * Wraps async route handlers to automatically catch promise rejections.
 * Eliminates need for try-catch blocks in async route handlers.
 * All caught errors are passed to Express error handling middleware via next(error).
 * 
 * @function asyncHandler
 * @param {Function} requestHandler - Async route handler function (req, res, next)
 * @returns {Function} Wrapped middleware function
 * 
 * @example
 * const myHandler = asyncHandler(async (req, res) => {
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * });
 * 
 * // Without asyncHandler, would need:
 * const myHandler = async (req, res, next) => {
 *   try {
 *     const data = await someAsyncOperation();
 *     res.json(data);
 *   } catch (error) {
 *     next(error);
 *   }
 * };
 */
const asyncHandler = (requestHandler) => {
  // Return wrapped middleware function
  return (req, res, next) => {
    // Wrap the request handler in Promise.resolve() to handle both:
    // - Functions that return promises
    // - Functions that throw errors
    // All errors are caught and passed to error handling middleware
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

// Export async handler utility
export { asyncHandler };
