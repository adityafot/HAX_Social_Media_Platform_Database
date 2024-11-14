const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');

const Post = connectDB.define('Post', {
    post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    caption: {
        type: DataTypes.TEXT,
        allowNull: true,       
    },
    resource_link: {
        type: DataTypes.STRING(255), 
        allowNull: true,   
        defaultValue: "",
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    likes_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    tableName: 'posts',
    timestamps: false,
});

module.exports = Post;

// Lazily load other models and define associations in a function
module.exports.initAssociations = () => {
    const PostLike = require('./postLike');
    const Comment = require('./comment');
    const User = require('./user');
    const savedPost = require('./savedPost')

    // Define associations here
    Post.hasMany(PostLike, {
        foreignKey: 'post_id',
        onDelete: 'CASCADE',
    });

    Post.hasMany(Comment, {
        foreignKey: 'post_id',
        onDelete: 'CASCADE',
    });

    Post.belongsToMany(User, {
        through: PostLike,
        as: 'likers',
        foreignKey: 'post_id',
        otherKey: 'liked_by_user_id'
    });

    Post.belongsTo(User, {
        foreignKey: 'user_id',
    });

    Post.belongsToMany(User, {
        through: savedPost,
        as: 'savedBy',  // Alias for the saved users
        foreignKey: 'post_id',
        otherKey: 'user_id',
    });
};

