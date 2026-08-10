/**
 * Email Sending Service
 * Handles email generation and sending using Mailgen and Nodemailer
 */

import Mailgen from "mailgen";
import nodemailer from "nodemailer";

/**
 * Send Email Function
 * 
 * Generates and sends emails using Mailgen for HTML templates and Nodemailer for SMTP.
 * Supports both HTML and plain text versions for email clients.
 * 
 * Requires environment variables:
 * - MAIL_TRAP_HOST: SMTP server host (e.g., smtp.mailtrap.io)
 * - MAIL_TRAP_PORT: SMTP server port
 * - MAIL_TRAP_USERNAME: SMTP authentication username
 * - MAIL_TRAP_PASSWORD: SMTP authentication password
 * 
 * @async
 * @function sendEmail
 * @param {string} email - Recipient email address
 * @param {Object} emailContant - Email content object (from emailContantGenerator)
 * @returns {Promise<void>}
 * 
 * @example
 * const emailData = getVerifyEmailContant("john", "http://example.com/verify/token");
 * await sendEmail("user@example.com", emailData);
 */
const sendEmail = async function (email, emailContant) {
  try {
    // ============ MAILGEN SETUP ============
    // Initialize Mailgen for email template generation
    var mailGenerator = new Mailgen({
      theme: "default", // Use default Mailgen theme
      product: {
        // Product name displayed in header & footer
        name: "Learn node ",
        // Product URL displayed in header & footer
        link: "https://Learnnode.js/",
      },
    });

    // ============ EMAIL BODY GENERATION ============
    // Generate HTML version of email from content object
    var emailBody = mailGenerator.generate(emailContant);

    // Generate plain text version of email for non-HTML clients
    var emailText = mailGenerator.generatePlaintext(emailContant);

    // ============ NODEMAILER SETUP ============
    // Create SMTP transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_TRAP_HOST,      // SMTP server hostname
      port: process.env.MAIL_TRAP_PORT,      // SMTP server port
      auth: {
        // SMTP authentication credentials
        user: process.env.MAIL_TRAP_USERNAME,
        pass: process.env.MAIL_TRAP_PASSWORD,
      },
    });

    // ============ SEND EMAIL ============
    // Send email with HTML and plain text versions
    await transporter.sendMail({
      from: "test@gmail.com",           // Sender email address
      to: email,                         // Recipient email address
      subject: "Learn node",             // Email subject
      text: emailText,                   // Plain-text version (fallback)
      html: emailBody,                   // HTML version (primary)
    });
  } catch (error) {
    // Log error without throwing to prevent request failure
    console.log("Error while sending email");
  }
};

// Export email sending function
export default sendEmail;
