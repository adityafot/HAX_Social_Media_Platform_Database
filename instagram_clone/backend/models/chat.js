const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const User = require('./user');

const Chat = connectDB.define('Chat', {
    chat_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user1_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,       // Foreign key to User model
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    user2_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,       // Foreign key to User model
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    started_at: {
        type: DataTypes.DATE,  // Use the correct Sequelize data type here
        allowNull: false,
        defaultValue: DataTypes.NOW 
    },
}, {
    tableName: 'chats',
    timestamps: false,
});

module.exports = Chat;
