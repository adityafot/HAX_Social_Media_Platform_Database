const {Sequelize, DataTypes} = require('sequelize');
const connectDB = require('../config/database')
const User = require('./user')
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
    }
}, {
    tableName: 'followers',
    timestamps: false
})

module.exports = Follower;

const Follower = require('../models/followers');

// Example function to follow a user
// async function followUser(userId, followerUserId) {
//     try {
//         const follow = await Follower.create({
//             user_id: userId,
//             follower_user_id: followerUserId,
//         });
//         return follow;
//     } catch (error) {
//         console.error('Error following user:', error);
//         throw error;
//     }
// }
