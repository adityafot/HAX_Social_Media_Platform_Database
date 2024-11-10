const { BadRequest, NotFound } = require('http-errors');
const Post = require('../models/post');
const User = require('../models/user');
const uploadToCloudinaryMiddleware = require('../middlewares/multer'); // Cloudinary upload middleware

// Controller for creating a new post
const createPost = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { caption, hashtags } = req.body;

        // Ensure the post has either a caption or an image
        if (!caption && !req.fileUrl) {
            throw new BadRequest('Post must have either a caption or an image.');
        }

        // Create a new post with Cloudinary image URL
        const newPost = await Post.create({
            user_id: userId,
            caption,
            image_url: req.fileUrl || null,  // Image URL from Cloudinary if uploaded
            hashtags: hashtags || []
        });

        res.status(201).json({
            message: 'Post created successfully!',
            postId: newPost.post_id,
            caption: newPost.caption,
            imageUrl: newPost.image_url
        });
    } catch (error) {
        next(error);
    }
};

// Controller for fetching all posts by a specific user
const getPostsByUser = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const posts = await Post.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });

        if (!posts || posts.length === 0) {
            throw new NotFound('No posts found for this user.');
        }

        res.status(200).json({ posts });
    } catch (error) {
        next(error);
    }
};

// Controller for fetching all posts
const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            order: [['created_at', 'DESC']]
        });

        if (!posts || posts.length === 0) {
            throw new NotFound('No posts found.');
        }

        res.status(200).json({ posts });
    } catch (error) {
        next(error);
    }
};

// Controller for fetching a single post by ID
const getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const post = await Post.findOne({ where: { post_id: postId } });

        if (!post) {
            throw new NotFound('Post not found.');
        }

        res.status(200).json({ post });
    } catch (error) {
        next(error);
    }
};

// Controller for updating a post
const updatePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { caption, hashtags } = req.body;
        const { userId } = req.user;

        const post = await Post.findOne({ where: { post_id: postId, user_id: userId } });

        if (!post) {
            throw new NotFound('Post not found or you are not authorized to update it.');
        }

        post.caption = caption || post.caption;
        post.hashtags = hashtags || post.hashtags;

        // Update image URL if provided (from Cloudinary)
        if (req.fileUrl) {
            post.image_url = req.fileUrl;
        }

        await post.save();

        res.status(200).json({
            message: 'Post updated successfully.',
            post
        });
    } catch (error) {
        next(error);
    }
};

// Controller for deleting a post
const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = req.user;

        const post = await Post.findOne({ where: { post_id: postId, user_id: userId } });

        if (!post) {
            throw new NotFound('Post not found or you are not authorized to delete it.');
        }

        await post.destroy();

        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

// Controller for liking a post
const likePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = req.user;

        const post = await Post.findOne({ where: { post_id: postId } });

        if (!post) {
            throw new NotFound('Post not found.');
        }

        const existingLike = await post.hasLiked(userId);
        if (existingLike) {
            return res.status(400).json({ message: 'You have already liked this post.' });
        }

        await post.addLiker(userId);

        res.status(200).json({ message: 'Post liked successfully.' });
    } catch (error) {
        next(error);
    }
};

// Controller for saving a post
const savePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = req.user;

        const post = await Post.findOne({ where: { post_id: postId } });

        if (!post) {
            throw new NotFound('Post not found.');
        }

        const existingSave = await post.hasSaved(userId);
        if (existingSave) {
            return res.status(400).json({ message: 'Post already saved.' });
        }

        await post.addSavedBy(userId);

        res.status(200).json({ message: 'Post saved successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getPostsByUser,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    savePost
};
