const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');

const User = connectDB.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bio: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false
    },
    profile_picture_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false,
    tableName: 'users'
});

module.exports = User;

module.exports.initAssociations = () => {
    const Post = require('./post');
    const PostLike = require('./postLike');
    const Story = require('./story')
    const savedPost = require('./savedPost')
    const Comment = require('./comment')
    const Notification = require('./notification')
    // Define associations here
    User.hasMany(Post, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
    });
    User.hasMany(Post, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
    });

    User.belongsToMany(Post, {
        through: PostLike,
        as: 'likedPosts',
        foreignKey: 'liked_by_user_id',
        otherKey: 'post_id'
    });

    User.belongsToMany(User, {
        as: 'following',
        through: 'follower',
        foreignKey: 'follower_user_id',
        otherKey: 'user_id'
    });

    User.hasMany(Story, {
        foreignKey: 'user_id', // The foreign key in the Story table that points to the User
        onDelete: 'CASCADE',   // If the user is deleted, their stories will be deleted
    });

    User.hasMany(Notification, {
        foreignKey: 'user_id', // The foreign key in the Story table that points to the User
        onDelete: 'CASCADE',   // If the user is deleted, their stories will be deleted
    });

    User.belongsToMany(User, {
        as: 'followers',
        through: 'follower',
        foreignKey: 'user_id',
        otherKey: 'follower_user_id'
    });
    User.belongsToMany(Post, {
        through: savedPost,
        as: 'savedPosts',  // Alias for saved posts
        foreignKey: 'user_id',
        otherKey: 'post_id',
    });
    User.hasMany(Comment, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
    });
    
};
