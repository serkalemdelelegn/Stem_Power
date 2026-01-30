require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");
const { verifyEmailConfig } = require("./config/email");
const Port = process.env.PORT || 5000;

// sync the database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Verify email configuration on startup
verifyEmailConfig();

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
