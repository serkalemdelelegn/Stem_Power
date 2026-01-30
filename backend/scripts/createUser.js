/**
 * Script to create or reset an admin user
 * Run with: node backend/scripts/createUser.js
 * 
 * Usage examples:
 *   node backend/scripts/createUser.js admin@example.com "Admin123" "Admin User"
 *   node backend/scripts/createUser.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const readline = require("readline");

// Get command line arguments
const args = process.argv.slice(2);
const emailArg = args[0];
const passwordArg = args[1];
const nameArg = args[2];

// Create readline interface for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createUser() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Connected to database\n");

    let email = emailArg;
    let password = passwordArg;
    let name = nameArg || "Admin User";
    let role = "admin";

    // If not provided via command line, ask interactively
    if (!email) {
      email = await question("Enter email address: ");
    }
    if (!password) {
      password = await question("Enter password (min 8 chars, must include uppercase, lowercase, and number): ");
    }
    if (!nameArg) {
      const nameInput = await question(`Enter name (default: "${name}"): `);
      if (nameInput.trim()) name = nameInput.trim();
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address");
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

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log(`\n⚠️  User with email "${email}" already exists.`);
      const update = await question("Do you want to update the password? (y/n): ");
      if (update.toLowerCase() === "y" || update.toLowerCase() === "yes") {
        const hashedPassword = await bcrypt.hash(password, 10);
        await existingUser.update({
          password: hashedPassword,
          role: role,
          is_active: true,
        });
        console.log(`\n✅ Password updated successfully for ${email}`);
        console.log(`   Role: ${role}`);
        console.log(`   Status: Active\n`);
      } else {
        console.log("\n❌ Operation cancelled.\n");
      }
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role,
        is_active: true,
      });

      console.log("\n✅ User created successfully!");
      console.log("─".repeat(50));
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: Active`);
      console.log("─".repeat(50));
      console.log("\n💡 You can now login with these credentials.\n");
    }
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

createUser();

