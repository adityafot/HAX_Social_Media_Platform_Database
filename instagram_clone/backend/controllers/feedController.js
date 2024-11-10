// controllers/feedController.js

const { Op } = require('sequelize');
const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const UserHashtagFollow = require('../models/userHashtagFollow');
const sequelize = require('../config/database'); // Ensure this path is correct

// Retrieves the user's feed, combining followed and trending posts
const getUserFeed = async (req, res, next) => {
    const userId = req.user.user_id; // Assuming user ID is available from auth middleware
    const pageSize = parseInt(req.query.page_size, 10) || 20;
    const page = parseInt(req.query.page, 10) || 1;
    const trendingStartDays = parseInt(req.query.trending_start_days, 10) || 1;

    try {
        // Validate user ID
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new BadRequest('Invalid user ID.');
        }

        // Find the current user and their following list
        const currentUser = await User.findByPk(userId, {
            include: [{
                model: User,
                as: 'following', // Ensure the alias 'following' is set in associations
                attributes: ['user_id']
            }]
        });

        if (!currentUser) {
            throw new NotFound('User not found.');
        }

        // Retrieve the list of followed user IDs
        const followedUserIds = currentUser.following.map(user => user.user_id);

        // Fetch followed posts with pagination
        const followedPosts = await Post.findAll({
            where: { user_id: followedUserIds },
            order: [['created_at', 'DESC']],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            include: [{
                model: User,
                attributes: ['user_id', 'username', 'profile_picture_url']
            }]
        });

        // Define time range for trending posts
        const endTime = new Date();
        const startTime = new Date();
        startTime.setDate(endTime.getDate() - trendingStartDays);

        // Fetch trending posts within the defined time range, ordered by likes and comments
        const trendingPosts = await Post.findAll({
            where: {
                created_at: {
                    [Op.between]: [startTime, endTime]
                }
            },
            order: [
                ['likes_count', 'DESC'],
                ['comments_count', 'DESC']
            ],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            include: [{
                model: User,
                attributes: ['user_id', 'username', 'profile_picture_url']
            }]
        });

        // Combine followed and trending posts, removing duplicates based on post_id
        const combinedPostsMap = new Map();

        followedPosts.forEach(post => {
            combinedPostsMap.set(post.post_id, post);
        });

        trendingPosts.forEach(post => {
            if (!combinedPostsMap.has(post.post_id)) {
                combinedPostsMap.set(post.post_id, post);
            }
        });

        const feedPosts = Array.from(combinedPostsMap.values());

        // Optionally, shuffle the feed
        // for (let i = feedPosts.length - 1; i > 0; i--) {
        //     const j = Math.floor(Math.random() * (i + 1));
        //     [feedPosts[i], feedPosts[j]] = [feedPosts[j], feedPosts[i]];
        // }

        // Format feed data for response
        const feedData = feedPosts.map(post => ({
            post_id: post.post_id,
            user_id: post.user_id,
            username: post.User.username,
            profile_picture_url: post.User.profile_picture_url,
            caption: post.caption,
            image_url: post.image_url,
            created_at: post.created_at,
            likes_count: post.likes_count,
            comments_count: post.comments_count
        }));

        res.status(200).json({ feed: feedData });
    } catch (error) {
        console.error('Error fetching feed:', error);
        next(error);
    }
};

module.exports = {
    getUserFeed
};
