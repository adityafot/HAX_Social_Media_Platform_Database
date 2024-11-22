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
        allowNull: true,  
        defaultValue : "",
    },
    caption: {
        type: DataTypes.TEXT,
        allowNull: true,  
    },
    created_at: {
        type: DataTypes.DATE,  
        allowNull: false,
        defaultValue: DataTypes.NOW 
    },
    created_at: {
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP + INTERVAL 24 HOUR"), 
    },
}, {
    tableName: 'stories',
    timestamps: false,
});

module.exports = Story;

module.exports.initAssociations = () => {
    const User = require('./user')
    Story.belongsTo(User, {
        foreignKey: 'user_id', // Each story belongs to one user
    });
}