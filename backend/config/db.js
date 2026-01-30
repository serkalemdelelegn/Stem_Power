const { Sequelize } = require("sequelize");
require("dotenv").config();

// DEBUG: confirm env is loaded
console.log("DB ENV CHECK:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  HAS_PASSWORD: !!process.env.DB_PASSWORD,
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL connected with Sequelize");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to database:", err.message);
  });

module.exports = sequelize;
