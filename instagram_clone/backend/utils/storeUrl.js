const User = require('../models/user');
const Post = require('../models/post');
const Story = require('../models/story');

const storeUrl = async (url, modelType, modelId) => {
    try {
        // Input validation
        if (!url || !modelType || !modelId) {
            throw new Error('Missing required parameters: URL, model type, or model ID');
        }

        console.log(`Storing URL for modelType: ${modelType}, modelId: ${modelId}`);

        let updateResult;
        switch (modelType.toLowerCase()) {
            case 'profile':
                if (!User) throw new Error('User model not found');
                updateResult = await User.update(
                    { profile_picture_url: url },
                    { where: { user_id: modelId } }
                );
                break;

            case 'post':
                if (!Post) throw new Error('Post model not found');
                updateResult = await Post.update(
                    { resource_link: url },
                    { where: { post_id: modelId } }
                );
                break;

            case 'story':
                if (!Story) throw new Error('Story model not found');
                updateResult = await Story.update(
                    { resource_link: url },
                    { where: { story_id: modelId } }
                );
                break;

            default:
                throw new Error(`Invalid model type provided: ${modelType}`);
        }

        // Check if any rows were affected by the update
        if (updateResult[0] === 0) {
            throw new Error(`${modelType.charAt(0).toUpperCase() + modelType.slice(1)} not found with ID: ${modelId}`);
        }

        console.log(`${modelType.charAt(0).toUpperCase() + modelType.slice(1)} updated successfully with URL: ${url}`);

        return {
            success: true,
            message: `${modelType.charAt(0).toUpperCase() + modelType.slice(1)} updated successfully`,
            url
        };

    } catch (error) {
        console.error(`Error storing URL: ${error.message}`);
        throw new Error(`Error storing URL: ${error.message}`);
    }
};

module.exports = storeUrl;