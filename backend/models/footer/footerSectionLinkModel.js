const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const FooterSectionLink = sequelize.define(
  "FooterSectionLink",
  {
    label: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    footerSectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "footer_sections",
        key: "id",
      },
    },
  },
  {
    tableName: "footer_section_links",
    timestamps: true,
  }
);

module.exports = FooterSectionLink;
