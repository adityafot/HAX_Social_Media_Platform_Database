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
            model: Chat,     
            key: 'chat_id',
        },
        onDelete: 'CASCADE',
    },
    sender_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,      
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    sent_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'chat_logs',
    timestamps: false,
});

module.exports = ChatLog;
