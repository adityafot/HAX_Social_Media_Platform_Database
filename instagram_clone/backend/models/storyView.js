const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const Story = require('./story');
const User = require('./user');

const StoryView = connectDB.define('StoryView', {
    view_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    story_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Story,
            key: 'story_id',
        },
        onDelete: 'CASCADE',
    },
    viewer_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,    
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    viewed_at: {
        type: DataTypes.DATE,  // Use the correct Sequelize data type here
        allowNull: false,
        defaultValue: DataTypes.NOW  // This automatically sets the current time
    },
}, {
    tableName: 'story_views',
    timestamps: false,
});

module.exports = StoryView;
