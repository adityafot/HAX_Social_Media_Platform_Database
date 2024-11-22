const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const User = require('./user');

const Follower = connectDB.define('Follower', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        },
        onDelete: 'CASCADE'
    },
    follower_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    followed_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'follower',
    timestamps: false
});

// Define associations for follower


module.exports = Follower;

module.exports.initAssociations = () => {
    const User = require('./user')
    
    Follower.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'following', // The user being followed
    });
    
    Follower.belongsTo(User, {
        foreignKey: 'follower_user_id',
        as: 'follower', // The user who is following
    });
}
