const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const Post = require('./post');
const User = require('./user');

const Comment = connectDB.define('Comment', {
    comment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,       // Foreign key to Post model
            key: 'post_id',
        },
        onDelete: 'CASCADE',
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,       // Foreign key to User model
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    commented_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    commented_at: {
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW  
    },
}, {
    tableName: 'comments',
    timestamps: false,
});

module.exports = Comment;

module.exports.initAssociations = () => {
    const User = require('./user')
    Comment.belongsTo(User, {
        foreignKey: 'user_id'
    });
}