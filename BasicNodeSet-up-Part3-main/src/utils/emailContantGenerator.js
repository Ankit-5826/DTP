/**
 * Email Content Generator
 * Creates email body content for verification and password reset emails
 * Uses Mailgen format for consistent HTML email generation
 */

/**
 * Generate Email Verification Content
 * 
 * Creates the content structure for email verification emails.
 * The returned object is formatted for Mailgen library to generate HTML emails.
 * 
 * @function getVerifyEmailContant
 * @param {string} username - User's username to personalize the email
 * @param {string} url - Email verification link for user to click
 * @returns {Object} Email content object formatted for Mailgen
 * 
 * @example
 * const emailData = getVerifyEmailContant("john_doe", "http://example.com/verify/token123");
 * await sendEmail(user.email, emailData);
 */
const getVerifyEmailContant = function (username, url) {
  return {
    body: {
      // User's name for personalization
      name: username,
      // Introductory message
      intro: "Wellcom to our app We are very happy to onbard you",
      // Action button with verification link
      action: {
        // Instructions above the button
        instructions:
          "To get started with Us, please click here verify your email:",
        // Button configuration
        button: {
          color: "#22BC66", // Green button color
          text: "Confirm your account",
          link: url, // Verification URL
        },
      },
      // Closing message
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

/**
 * Generate Forgot Password Email Content
 * 
 * Creates the content structure for password reset emails.
 * The returned object is formatted for Mailgen library to generate HTML emails.
 * 
 * @function getForgotPasswordEmailContant
 * @param {string} username - User's username to personalize the email
 * @param {string} url - Password reset link for user to click
 * @returns {Object} Email content object formatted for Mailgen
 * 
 * @example
 * const emailData = getForgotPasswordEmailContant("john_doe", "http://example.com/reset/token456");
 * await sendEmail(user.email, emailData);
 */
const getForgotPasswordEmailContant = function (username, url) {
  return {
    body: {
      // User's name for personalization
      name: username,
      // Introductory message about password reset
      intro: "We got request to change your accout password",
      // Action button with reset link
      action: {
        // Instructions above the button
        instructions: "To reset your password please click here",
        // Button configuration
        button: {
          color: "#22BC66", // Green button color
          text: "Rest Password",
          link: url, // Password reset URL
        },
      },
      // Closing message
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

// Export email content generator functions
export { getVerifyEmailContant, getForgotPasswordEmailContant };
