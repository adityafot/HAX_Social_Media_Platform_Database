const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const Post = require('./post');
const User = require('./user');

const PostLike = connectDB.define('PostLike', {
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,     
            key: 'post_id',
        },
        onDelete: 'CASCADE',
    },
    liked_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,     
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    liked_at: {
        type: DataTypes.DATE,  // Use the correct Sequelize data type here
        allowNull: false,
        defaultValue: DataTypes.NOW  // This automatically sets the current time
    },
}, {
    tableName: 'post_likes',
    timestamps: false,
});

module.exports = PostLike;
