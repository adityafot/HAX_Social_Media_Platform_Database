const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const User = require('./user');

const Story = connectDB.define('Story', {
    story_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,      
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    resource_link: {
        type: DataTypes.STRING(255),
        allowNull: false,  
    },
    caption: {
        type: DataTypes.TEXT,
        allowNull: true,  
    },
    created_at: {
        type: DataTypes.DATE,  // Use the correct Sequelize data type here
        allowNull: false,
        defaultValue: DataTypes.NOW  // This automatically sets the current time
    },
    created_at: {
        type: DataTypes.DATE,  // Use the correct Sequelize data type here
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP + INTERVAL 24 HOUR"),  // This automatically sets the current time
    },
}, {
    tableName: 'stories',
    timestamps: false,
});

module.exports = Story;
