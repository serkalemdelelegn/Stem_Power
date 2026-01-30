const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const User = require("../userModel");
const News = require("./newsModel");

const NewsLike = sequelize.define(
  "NewsLike",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    tableName: "news_likes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "newsId"], // prevent duplicate likes from the same user
      },
    ],
  }
);

// Relations
User.hasMany(NewsLike, { foreignKey: "userId", onDelete: "CASCADE" });
NewsLike.belongsTo(User, { foreignKey: "userId" });

News.hasMany(NewsLike, { foreignKey: "newsId", onDelete: "CASCADE" });
NewsLike.belongsTo(News, { foreignKey: "newsId" });

module.exports = NewsLike;
