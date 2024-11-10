const {Sequelize, DataTypes} = require('sequelize');
const connectDB = require('../config/database');
const User = require('./user')
const Post = connectDB.define('Post',{
    post_id: {
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
    caption: {
        type: DataTypes.TEXT,
        allowNull: true,       
    },
    resource_link: {
        type: DataTypes.STRING(255), 
        allowNull: false,    
    },
    created_at: {
        type: DataTypes.DATE,  // Use the correct Sequelize data type here
        allowNull: false,
        defaultValue: DataTypes.NOW  // This automatically sets the current time
    },
},   {
        tableName: 'posts',         
        timestamps: false,          
});

Post.hasMany(require('./postLike'), {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
});
Post.hasMany(require('./comment'), {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
});

module.exports = Post;
