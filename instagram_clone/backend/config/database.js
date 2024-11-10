const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = new Sequelize({
    host: 'localhost',          // Database server address (usually 'localhost' for local dev)
    dialect: 'mysql',           // Dialect of the database, which is MySQL in this case
    username: 'root',           // Your MySQL username (replace with your actual username)
    password: process.env.DB_PASS, // Your MySQL password (replace with your actual password)
    database: 'dbms_social_media_app_instagram', // Name of your database
    logging: false,             // Disable logging (you can set it to true for debugging)
    pool: {
        max: 5,                 // Max number of connections in the pool
        min: 0,                 // Min number of connections in the pool
        acquire: 30000,         // Max time, in ms, that a connection can be idle before being released
        idle: 10000             // Max time, in ms, before a connection is considered "idle" and can be closed
    },
});

// Test the connection to ensure everything is set up properly
const testConnection = async () => {
    try {
        // Try to authenticate the connection
        await connectDB.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

testConnection();

module.exports = connectDB;
