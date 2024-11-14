const express = require('express');
const router = express.Router();
const { createComment, getCommentsByPost, deleteComment } = require('../controllers/commentController');
const authenticateJWT = require('../middlewares/authMiddleware');

// Create a new comment on a post
router.post('/create',authenticateJWT, createComment);

// Get all comments for a post
router.get('/:post_id', getCommentsByPost);

// Delete a comment
router.delete('/delete/:comment_id',authenticateJWT, deleteComment);

module.exports = router;
