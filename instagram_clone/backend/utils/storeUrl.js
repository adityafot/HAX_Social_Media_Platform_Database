const { User } = require('../models/user');  // Import Sequelize models
const { Post } = require('../models/post');  // Import Sequelize models
const { Story } = require('../models/story');  // Import Sequelize models

// Function to store URL in the relevant table (user, post, story)
const storeUrl = async (url, modelType, modelId) => {
    try {
        if (!url || !modelType || !modelId) {
            throw new Error('Missing required parameters: URL, model type, or model ID');
        }

        let updateResult;
        switch (modelType) {
            case 'profile':
                // Update user's profile picture URL
                updateResult = await User.update({ profile_picture_url: url }, {
                    where: { user_id: modelId }
                });
                break;
            case 'post':
                // Update post's resource link (for image or video)
                updateResult = await Post.update({ resource_link: url }, {
                    where: { post_id: modelId }
                });
                break;
            case 'story':
                // Update story's resource link (for image or video)
                updateResult = await Story.update({ resource_link: url }, {
                    where: { story_id: modelId }
                });
                break;
            default:
                throw new Error('Invalid model type provided');
        }

        if (updateResult[0] === 0) {
            throw new Error(`${modelType.charAt(0).toUpperCase() + modelType.slice(1)} not found for the given ID.`);
        }

        return {
            message: `${modelType.charAt(0).toUpperCase() + modelType.slice(1)} updated successfully`,
            url
        };

    } catch (error) {
        throw new Error(`Error storing URL: ${error.message}`);
    }
};

module.exports = storeUrl;
