const express = require('express');
const router = express.Router();
const { createStory, getStories, getStoryById, deleteStory, getStoryByUser } = require('../controllers/storyController');
const { upload} = require('../middlewares/multer'); // Middleware for file upload
const authenticateJWT = require('../middlewares/authMiddleware');
// const { getPostsByUser } = require('../controllers/postController');

// Create a new story
router.post('/create',authenticateJWT, upload, createStory);

// Get all stories of the logged-in user
router.get('/user', getStories);

// Get a specific story by ID
router.get('/:storyId', getStoryById);

// Delete a specific story
router.delete('/delete/:storyId', deleteStory);

router.get('/user/:user_id', getStoryByUser);

module.exports = router;
