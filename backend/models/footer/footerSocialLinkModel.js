const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const FooterSocialLink = sequelize.define(
  "FooterSocialLink",
  {
    platform: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: { isUrl: true },
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "footer_social_links",
    timestamps: true,
  }
);

module.exports = FooterSocialLink;
