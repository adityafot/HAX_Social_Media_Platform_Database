const { validationResult } = require('express-validator');
const createError = require('http-errors');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const uploadToCloudinaryMiddleware = require('../middlewares/multer');  // Cloudinary upload middleware
const { createNotification } = require('./notificationController');

// Create a new comment on a post
const createComment = async (req, res) => {
    const { post_id, commented_text } = req.body;
    const user_id = req.user.userId; // Assuming you're using JWT for authentication and user info is attached to req.user
    
    try {
        // Check if the post exists
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));
            return res.status(400).json({ errors: extractedErrors });
        }
        
        // Handle file upload if there's a file
        // let fileUrl = null;
        // if (req.fileUrl) {
        //     fileUrl = req.fileUrl; // Cloudinary URL
        // }

        // Create a new comment
        const newComment = await Comment.create({
            post_id,
            user_id,
            commented_text,
            // media_url: fileUrl  // Store media URL if file uploaded
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

// Get all comments for a post
const getCommentsByPost = async (req, res) => {
    const { post_id } = req.params;

    try {
        // Check if the post exists
        console.log(post_id);
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Fetch all comments for the post
        const comments = await Comment.findAll({
            where: { post_id },
            // include: {
            //     model: User,
            //     attributes: ['user_id', 'username', 'profile_picture_url'] // Include user info
            // }
        });

        return res.status(200).json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};

// Update a comment
// const updateComment = async (req, res) => {
//     const { comment_id } = req.params;
//     const { commented_text } = req.body;
//     const user_id = req.user.userId;

//     try {
//         // Find the comment by ID
//         const comment = await Comment.findByPk(comment_id);
//         if (!comment) {
//             return res.status(404).json({ message: 'Comment not found' });
//         }

//         // Ensure the comment belongs to the authenticated user
//         if (comment.user_id !== user_id) {
//             return res.status(403).json({ message: 'You are not authorized to update this comment' });
//         }

//         // Update the comment
//         comment.commented_text = commented_text;
//         await comment.save();

//         return res.status(200).json({ message: 'Comment updated successfully', comment });
//     } catch (error) {
//         console.error('Error updating comment:', error);
//         return res.status(500).json({ message: 'Error updating comment', error: error.message });
//     }
// };

// Delete a comment
const deleteComment = async (req, res) => {
    const { comment_id } = req.params;
    const user_id = req.user.userId;

    try {
        // Find the comment by ID
        const comment = await Comment.findByPk(comment_id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Ensure the comment belongs to the authenticated user
        if (comment.user_id !== user_id) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }

        // Delete the comment
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
    // updateComment,
    deleteComment
};
