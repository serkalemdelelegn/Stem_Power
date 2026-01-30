const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development, you can use Gmail, Outlook, or any SMTP service
  // For production, use a proper email service like SendGrid, Mailgun, etc.
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Your email address
      pass: process.env.SMTP_PASSWORD, // Your email password or app-specific password
    },
  });

  return transporter;
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email configuration error:", error.message);
    console.warn("⚠️  Email functionality will be disabled. Please configure SMTP settings in .env");
    return false;
  }
};

module.exports = {
  createTransporter,
  verifyEmailConfig,
};

