const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const Post = require('./post');
const User = require('./user');

const SavedPost = connectDB.define('SavedPost', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,     
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,    
            key: 'post_id',
        },
        onDelete: 'CASCADE',
    },
    saved_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'saved_posts',
    timestamps: false,
});

module.exports = SavedPost;
