const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler'); 
const userRoutes = require('./routes/userRoutes'); 
const postRoutes = require('./routes/postRoutes');
const storyRoutes = require('./routes/storyRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authenticateJWT = require('./middlewares/authMiddleware')
const Sequelize = require('sequelize');
const chatRoutes = require('./routes/chatRoutes')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5151;

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// Use middleware
app.use(cookieParser()); // To parse cookies if JWT or session cookies are used
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To handle form submissions

// Routes
app.use('/api/posts',authenticateJWT, postRoutes); // Post routes
app.use('/api/stories',authenticateJWT, storyRoutes); // Story routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/comments', commentRoutes); // Comment-related routes
app.use('/api/chats', chatRoutes);
// Default route
app.get('/', (req, res) => {
    res.status(200).send('Hello, World!');
});

// Error handling middleware should be placed after all routes
app.use(errorHandler); // This should handle errors thrown by your controllers

// Start server
app.listen(PORT, async () => {
    try {
        await connectDB.authenticate(); // Test the database connection
        console.log('Database connection established successfully');
        console.log(`Server has started on PORT: ${PORT}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
