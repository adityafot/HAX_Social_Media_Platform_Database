const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');
const User = require('./user');
const Hashtag = require('./hashtag');

const UserHashtagFollow = connectDB.define('UserHashtagFollow', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,      // Foreign key to User model
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    hashtag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Hashtag,   // Foreign key to Hashtag model
            key: 'hashtag_id',
        },
        onDelete: 'CASCADE',
    },
    followed_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'user_hashtag_follows',
    timestamps: false,
});

module.exports = UserHashtagFollow;
