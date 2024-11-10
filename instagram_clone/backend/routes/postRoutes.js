const express = require('express');
const router = express.Router();
const { createPost, getPostsByUser, getAllPosts, getPostById, updatePost, deletePost, likePost, savePost } = require('../controllers/postController');
const uploadToCloudinaryMiddleware = require('../middlewares/multer'); // Middleware for file upload

// Create a new post
router.post('/create', uploadToCloudinaryMiddleware, createPost);

// Get all posts of a specific user
router.get('/user', getPostsByUser);

// Get all posts globally
router.get('/', getAllPosts);

// Get a specific post by ID
router.get('/:postId', getPostById);

// Update a post
router.put('/update/:postId', uploadToCloudinaryMiddleware, updatePost);

// Delete a post
router.delete('/delete/:postId', deletePost);

// Like a post
router.post('/like/:postId', likePost);

// Save a post
router.post('/save/:postId', savePost);

module.exports = router;
