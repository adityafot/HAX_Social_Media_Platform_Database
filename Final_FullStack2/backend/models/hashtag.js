const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../config/database');

const Hashtag = connectDB.define('Hashtag', {
    hashtag_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    hashtag_name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
}, {
    tableName: 'hashtags',
    timestamps: false,
});

module.exports = Hashtag;
