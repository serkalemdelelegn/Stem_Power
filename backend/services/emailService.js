const { createTransporter } = require("../config/email");

/**
 * Send welcome email to newly created admin user
 * @param {Object} userData - User information
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password (plain text, only sent on creation)
 * @param {string} userData.role - User's role (admin, editor, etc.)
 * @param {Object|null} userData.permissions - User's page permissions
 * @returns {Promise<Object>} Email sending result
 */
const sendWelcomeEmail = async (userData) => {
  try {
    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("⚠️  Email not configured. Skipping welcome email.");
      return { success: false, message: "Email not configured" };
    }

    const transporter = createTransporter();

    // Get admin dashboard URL (from environment or default)
    const adminUrl = process.env.ADMIN_URL || "http://localhost:3000/admin";
    const siteName = process.env.SITE_NAME || "STEMpower Ethiopia";

    // Format permissions list
    let permissionsText = "Full access to all pages";
    if (userData.permissions && typeof userData.permissions === "object") {
      const permissionKeys = Object.keys(userData.permissions);
      if (permissionKeys.length === 0) {
        permissionsText = "No specific page access (limited admin)";
      } else {
        const pageNames = permissionKeys
          .map((key) => {
            const pageMap = {
              home: "Home",
              about: "About Us",
              programs: "Programs",
              latest: "Latest News",
              contact: "Contact Us",
              location: "Locations",
              header: "Header Navigation",
              footer: "Footer",
              account: "Account Management",
              profile: "Profile",
            };
            return pageMap[key] || key;
          })
          .join(", ");
        permissionsText = `Access to: ${pageNames}`;
      }
    }

    // Email content
    const mailOptions = {
      from: `"${siteName} Admin" <${process.env.SMTP_USER}>`,
      to: userData.email,
      subject: `Welcome to ${siteName} Admin Dashboard`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #00BFA6 0%, #00A693 100%);
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              margin: -30px -30px 30px -30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              margin: 20px 0;
            }
            .info-box {
              background-color: #f8f9fa;
              border-left: 4px solid #00BFA6;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .credentials {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .credentials strong {
              color: #856404;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #00BFA6 0%, #00A693 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .button:hover {
              opacity: 0.9;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              padding: 10px;
              margin: 15px 0;
              border-radius: 4px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${siteName}!</h1>
            </div>
            
            <div class="content">
              <p>Hello <strong>${userData.name}</strong>,</p>
              
              <p>You have been added as an administrator to the ${siteName} website management system.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0;">Your Account Details:</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Role:</strong> ${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</li>
                  <li><strong>Permissions:</strong> ${permissionsText}</li>
                </ul>
              </div>
              
              <div class="credentials">
                <h3 style="margin-top: 0; color: #856404;">Your Login Credentials:</h3>
                <p><strong>Email:</strong> ${userData.email}</p>
                <p><strong>Password:</strong> ${userData.password}</p>
                <div class="warning">
                  <strong>⚠️ Important:</strong> Please change your password after your first login for security purposes.
                </div>
              </div>
              
              <p>You can now access the admin dashboard using the link below:</p>
              
              <div style="text-align: center;">
                <a href="${adminUrl}/login" class="button">Access Admin Dashboard</a>
              </div>
              
              <p>If you have any questions or need assistance, please contact the system administrator.</p>
            </div>
            
            <div class="footer">
              <p>This is an automated email from ${siteName}.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text version for email clients that don't support HTML
      text: `
Welcome to ${siteName}!

Hello ${userData.name},

You have been added as an administrator to the ${siteName} website management system.

Your Account Details:
- Role: ${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
- Permissions: ${permissionsText}

Your Login Credentials:
- Email: ${userData.email}
- Password: ${userData.password}

⚠️ Important: Please change your password after your first login for security purposes.

You can access the admin dashboard at: ${adminUrl}/login

If you have any questions or need assistance, please contact the system administrator.

This is an automated email from ${siteName}. Please do not reply to this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userData.email}`);
    return {
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
    // Don't throw error - email failure shouldn't prevent user creation
    return {
      success: false,
      error: error.message,
      message: "Failed to send email, but user was created successfully",
    };
  }
};

module.exports = {
  sendWelcomeEmail,
};

