const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = new Sequelize({
    host: 'localhost',
    dialect: 'mysql',
    username: 'root',
    password: process.env.DB_PASS,
    database: 'dbms_social_media_app_instagram',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // Add these options for better control over table creation
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true, // Enable timestamps by default
        underscored: true, // Use snake_case rather than camelCase for fields
    },
    sync: {
        // Enable table creation
        force: false, // WARNING: setting this to true will drop existing tables
        alter: true, // This will alter existing tables to match your models
    }
});

// Test the connection to ensure everything is set up properly
const testConnection = async () => {
    try {
        await connectDB.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

testConnection();

module.exports = connectDB;