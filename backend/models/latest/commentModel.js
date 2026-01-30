const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const User = require("../userModel");
const News = require("./newsModel");

const NewsComment = sequelize.define(
  "NewsComment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    newsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: News,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "news_comments",
    timestamps: true,
  }
);

// Relations
User.hasMany(NewsComment, { foreignKey: "userId", onDelete: "CASCADE" });
NewsComment.belongsTo(User, { foreignKey: "userId" });

News.hasMany(NewsComment, { foreignKey: "newsId", onDelete: "CASCADE" });
NewsComment.belongsTo(News, { foreignKey: "newsId" });

module.exports = NewsComment;
