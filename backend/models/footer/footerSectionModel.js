const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const FooterSectionLink = require("./footerSectionLinkModel");

const FooterSection = sequelize.define(
  "FooterSection",
  {
    title: {
      type: DataTypes.STRING(200),
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
  },
  {
    tableName: "footer_sections",
    timestamps: true,
  }
);

// Relations
FooterSection.hasMany(FooterSectionLink, {
  foreignKey: "footerSectionId",
  as: "links",
  onDelete: "CASCADE",
});
FooterSectionLink.belongsTo(FooterSection, {
  foreignKey: "footerSectionId",
  as: "section",
});

module.exports = FooterSection;
