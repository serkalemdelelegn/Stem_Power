/**
 * Script to reset a user's password
 * Run with: node backend/scripts/resetPassword.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const readline = require("readline");

const args = process.argv.slice(2);
const emailArg = args[0];
const passwordArg = args[1];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function resetPassword() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database\n");

    let email = emailArg;
    let password = passwordArg;

    if (!email) {
      email = await question("Enter user email to reset password: ");
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`\n❌ User with email "${email}" not found.\n`);
      return;
    }

    console.log(`\n📋 Found user: ${user.name} (${user.email})`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.is_active ? "Yes" : "No"}\n`);

    if (!password) {
      password = await question("Enter new password (min 8 chars, must include uppercase, lowercase, and number): ");
    }

    // Validate password
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!strongPassword.test(password)) {
      throw new Error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
      );
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });

    console.log("\n✅ Password reset successfully!");
    console.log(`   Email: ${user.email}`);
    console.log(`   New password has been set.\n`);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.message.includes("ECONNREFUSED")) {
      console.error("\n💡 Make sure your database is running and check your .env file.");
    }
  } finally {
    rl.close();
    await sequelize.close();
  }
}

resetPassword();

