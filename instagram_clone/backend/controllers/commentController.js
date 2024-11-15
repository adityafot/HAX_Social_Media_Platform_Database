const { validationResult } = require('express-validator');
const createError = require('http-errors');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const uploadToCloudinaryMiddleware = require('../middlewares/multer'); 
const { createNotification } = require('./notificationController');

const createComment = async (req, res) => {
    const { post_id, commented_text } = req.body;
    const user_id = req.user.userId;
    
    try {
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));
            return res.status(400).json({ errors: extractedErrors });
        }

        const newComment = await Comment.create({
            post_id,
            user_id,
            commented_text,
        });

        await createNotification(post.user_id, "comment");

        return res.status(201).json({
            message: 'Comment created successfully',
            comment: newComment
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
};

const getCommentsByPost = async (req, res) => {
    const { post_id } = req.params;

    try {
        console.log(post_id);
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comments = await Comment.findAll({
            where: { post_id },
        });

        return res.status(200).json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};


const deleteComment = async (req, res) => {
    const { comment_id } = req.params;
    const user_id = req.user.userId;

    try {
        const comment = await Comment.findByPk(comment_id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user_id !== user_id) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }

        await comment.destroy();

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    deleteComment
};
