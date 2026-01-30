const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const News = sequelize.define(
  "News",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM("newsletter", "press", "social"),
      allowNull: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    // Newsletter-specific fields
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      comment: "URL-friendly slug for newsletter",
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Short description/excerpt for newsletter",
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Category for newsletter (e.g., 'Updates', 'Events', 'Impact')",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Publication date for newsletter",
    },
    readTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Estimated read time (e.g., '5 min read')",
    },
    pdfUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "URL to PDF version of newsletter",
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether this newsletter is featured",
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Author name",
    },
    // Social media-specific fields
    platform: {
      type: DataTypes.ENUM("Facebook", "LinkedIn", "Twitter", "Instagram"),
      allowNull: true,
      comment: "Social media platform for social source posts",
    },
    link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "URL to original social media post",
    },
    shares: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Number of shares for social media posts",
    },
    // Press-specific fields
    publication: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment:
        "Publication name for press articles (e.g., 'Ethiopian Herald', 'Addis Standard')",
    },
    publicationType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment:
        "Type of publication (e.g., 'Newspaper', 'Online Magazine', 'Blog')",
    },
    quote: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Featured quote from the press article",
    },
    topic: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Topic or theme of the press article",
    },
  },
  {
    tableName: "news",
    timestamps: true,
  }
);

module.exports = News;
