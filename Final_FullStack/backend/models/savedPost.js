const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const Post = require('./post');
const User = require('./user');

const SavedPost = connectDB.define('SavedPost', {
  post_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Post,
      key: 'post_id',
    },
    onDelete: 'CASCADE',
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'saved_posts',
  timestamps: false,
});

module.exports = SavedPost;