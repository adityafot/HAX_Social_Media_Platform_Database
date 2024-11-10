const express = require('express');
const router = express.Router();
const { createStory, getStories, getStoryById, deleteStory } = require('../controllers/storyController');
const uploadToCloudinaryMiddleware = require('../middlewares/multer'); // Middleware for file upload

// Create a new story
router.post('/create', uploadToCloudinaryMiddleware, createStory);

// Get all stories of the logged-in user
router.get('/user', getStories);

// Get a specific story by ID
router.get('/:storyId', getStoryById);

// Delete a specific story
router.delete('/delete/:storyId', deleteStory);

module.exports = router;
