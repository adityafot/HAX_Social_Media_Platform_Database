const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const Chat = require('./chat');
const User = require('./user');

const ChatLog = connectDB.define('ChatLog', {
    log_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Chat,       // Foreign key to Chat model
            key: 'chat_id',
        },
        onDelete: 'CASCADE',
    },
    sender_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,       // Foreign key to User model
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    sent_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'chat_logs',
    timestamps: false,
});

module.exports = ChatLog;
