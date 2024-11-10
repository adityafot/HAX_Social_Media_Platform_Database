// controllers/hashtagController.js

const { BadRequest, NotFound, Conflict } = require('http-errors');
const Hashtag = require('../models/hashtag');
const Post = require('../models/post');
const UserHashtagFollow = require('../models/userHashtagFollow');
const PostHashtag = require('../models/postHashtag');
const { validationResult } = require('express-validator');

// Add hashtags to a post
const addHashtagsToPost = async (req, res, next) => {
    const { postId, hashtags } = req.body;

    try {
        // Validate request body
        if (!postId || !hashtags) {
            throw new BadRequest('postId and hashtags are required.');
        }

        if (!Array.isArray(hashtags)) {
            throw new BadRequest('Hashtags must be an array.');
        }

        // Verify the post exists
        const post = await Post.findByPk(postId);
        if (!post) {
            throw new NotFound('Post not found.');
        }

        for (const tag of hashtags) {
            // Sanitize and normalize the hashtag
            const normalizedTag = tag.trim().toLowerCase();

            if (!normalizedTag.startsWith('#')) {
                throw new BadRequest(`Invalid hashtag format: ${tag}. Hashtags must start with '#'.`);
            }

            // Remove the '#' for storage consistency
            const tagName = normalizedTag.slice(1);

            let hashtag = await Hashtag.findOne({ where: { hashtag_name: tagName } });

            // If hashtag doesn't exist, create it
            if (!hashtag) {
                hashtag = await Hashtag.create({ hashtag_name: tagName });
            }

            // Check if the association already exists to prevent duplicates
            const existingAssociation = await PostHashtag.findOne({
                where: {
                    post_id: postId,
                    hashtag_id: hashtag.hashtag_id
                }
            });

            if (!existingAssociation) {
                // Link the post and hashtag
                await PostHashtag.create({
                    post_id: postId,
                    hashtag_id: hashtag.hashtag_id,
                });
            }
        }

        res.status(200).json({ message: 'Hashtags added successfully to the post.' });
    } catch (error) {
        next(error);
    }
};

// Get posts by hashtag
const getPostsByHashtag = async (req, res, next) => {
    const { tag } = req.params;

    try {
        if (!tag) {
            throw new BadRequest('Hashtag is required.');
        }

        // Remove '#' if present and normalize
        const normalizedTag = tag.trim().toLowerCase().startsWith('#') ? tag.trim().toLowerCase().slice(1) : tag.trim().toLowerCase();

        const hashtag = await Hashtag.findOne({ where: { hashtag_name: normalizedTag } });
        if (!hashtag) {
            throw new NotFound('Hashtag not found.');
        }

        const postHashtags = await PostHashtag.findAll({
            where: { hashtag_id: hashtag.hashtag_id },
            include: {
                model: Post,
                attributes: ['post_id', 'caption', 'image_url', 'created_at'],
                include: {
                    model: User,
                    attributes: ['user_id', 'username', 'profile_picture_url']
                }
            }
        });

        const posts = postHashtags.map(item => item.Post);
        res.status(200).json({ posts });
    } catch (error) {
        next(error);
    }
};

// Follow a hashtag
const followHashtag = async (req, res, next) => {
    const { hashtagName } = req.body;
    const userId = req.user.user_id; // Assuming user ID is available from auth middleware

    try {
        if (!hashtagName) {
            throw new BadRequest('hashtagName is required.');
        }

        // Normalize and sanitize the hashtag
        const normalizedTag = hashtagName.trim().toLowerCase();

        if (!normalizedTag.startsWith('#')) {
            throw new BadRequest('Invalid hashtag format. Hashtags must start with "#".');
        }

        // Remove the '#' for storage consistency
        const tagName = normalizedTag.slice(1);

        let hashtag = await Hashtag.findOne({ where: { hashtag_name: tagName } });

        if (!hashtag) {
            hashtag = await Hashtag.create({ hashtag_name: tagName });
        }

        // Check if the user already follows the hashtag
        const existingFollow = await UserHashtagFollow.findOne({
            where: {
                user_id: userId,
                hashtag_id: hashtag.hashtag_id
            }
        });

        if (existingFollow) {
            throw new Conflict('You are already following this hashtag.');
        }

        await UserHashtagFollow.create({
            user_id: userId,
            hashtag_id: hashtag.hashtag_id,
        });

        res.status(200).json({ message: 'Successfully followed the hashtag.' });
    } catch (error) {
        next(error);
    }
};

// Get followed hashtags by a user
const getFollowedHashtags = async (req, res, next) => {
    const userId = req.user.user_id; // Assuming user ID is available from auth middleware

    try {
        const followedHashtags = await UserHashtagFollow.findAll({
            where: { user_id: userId },
            include: {
                model: Hashtag,
                attributes: ['hashtag_name'],
            },
        });

        const hashtags = followedHashtags.map(follow => follow.Hashtag);
        res.status(200).json({ hashtags });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addHashtagsToPost,
    getPostsByHashtag,
    followHashtag,
    getFollowedHashtags
};
