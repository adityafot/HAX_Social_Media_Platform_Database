const express = require('express');
const router = express.Router();
const { createComment, getCommentsByPost, deleteComment } = require('../controllers/commentController');

// Create a new comment on a post
router.post('/create', createComment);

// Get all comments for a post
router.get('/:postId', getCommentsByPost);

// Delete a comment
router.delete('/delete/:commentId', deleteComment);

module.exports = router;
