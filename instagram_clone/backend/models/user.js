const {Sequelize, DataTypes} = require('sequelize');
const connectDB = require('../config/database')

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
        allowNull:true
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false
    },
    profile_picture_url :{
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

User.sync();

module.exports = User;


// const newUser = await User.create({
//     username: 'mera_doe',
//     password: 'hashedPassword', 
//     bio: 'This is meri bio',
//     profile_picture_url: 'http://meriprofile.com/profile.jpg'
// });
