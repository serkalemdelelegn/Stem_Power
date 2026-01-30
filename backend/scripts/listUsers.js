/**
 * Script to list all users in the database
 * Run with: node backend/scripts/listUsers.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const User = require("../models/userModel");
const sequelize = require("../config/db");

async function listUsers() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Connected to database\n");

    // Get all users
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "is_active", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    if (users.length === 0) {
      console.log("❌ No users found in the database.");
      console.log("\n💡 To create a user, run: node backend/scripts/createUser.js\n");
      return;
    }

    console.log(`📋 Found ${users.length} user(s):\n`);
    console.log("─".repeat(80));

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.is_active ? "✅ Yes" : "❌ No"}`);
      console.log(`   Created: ${user.createdAt}`);
    });

    console.log("\n" + "─".repeat(80));
    console.log("\n💡 Note: Passwords are hashed and cannot be displayed.");
    console.log("💡 To reset a password, use the admin panel or create a new user.\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.message.includes("ECONNREFUSED")) {
      console.error("\n💡 Make sure your database is running and check your .env file.");
    }
  } finally {
    await sequelize.close();
  }
}

listUsers();

