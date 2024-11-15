const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const User = require('./user');

const Notification = connectDB.define('Notification', {
    notification_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    type: {
        type: DataTypes.ENUM('like', 'comment', 'follow'),
        allowNull: false,
    },
    reference_id: {
        type: DataTypes.INTEGER, 
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    // is_read: {
    //     type: DataTypes.BOOLEAN,
    //     defaultValue: false,
    // },
}, {
    tableName: 'notifications',
    timestamps: false,
});

module.exports = Notification;

module.exports.initAssociations = () => {
    const User = require('./user')
    Notification.belongsTo(User, {
        foreignKey: 'user_id'
    });
}