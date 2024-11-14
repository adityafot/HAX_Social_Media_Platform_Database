const Story = require('../models/story');
// const StoryView = require('../models/storyView');
const User = require('../models/user');
const dataUri = require('../utils/datauri');
// const {storeUrl} = require('../utils/storeUrl');
const uploadToCloudinary = require('../utils/cloudinary');
// const uploadToCloudinaryMiddleware = require('../middlewares/multer');

// Create a new story
const createStory = async (req, res) => {
    const { caption } = req.body;
    const user_id = req.user.userId; // Assuming you're using JWT for authentication

    // if (!req.fileUrl) {
    //     return res.status(400).json({ message: 'No file URL available' });
    // }
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = dataUri(req.file);

    try {
        // Step 1: Upload the file to Cloudinary
        const result = await uploadToCloudinary(file);
        if (!result || !result.secure_url) {
            console.error('Error: Cloudinary upload failed');
            return res.status(500).json({ message: 'Cloudinary upload failed' });
        }

        // Step 2: Create a new story with the Cloudinary URL
        const newStory = await Story.create({
            user_id,
            resource_link: result.secure_url,  // Use Cloudinary URL here
            caption
        });

        // Step 3: Update the newly created story with the Cloudinary URL if needed
        const updateResult = await Story.update(
            { resource_link: result.secure_url },
            { where: { story_id: newStory.story_id } }
        );

        // if (updateResult[0] === '') {
        //     throw new Error('Failed to update story with Cloudinary URL');
        // }

        return res.status(201).json({
            message: 'Story created successfully',
            story: newStory,
            imageUrl: result.secure_url
        });
    } catch (error) {
        console.error('Error creating story:', error);
        return res.status(500).json({ message: 'Error creating story', error: error.message });
    }
};

const getStoryByUser = async (req, res) => {
    const { user_id } = req.params; // Access user_id from req.params

    try {
        const stories = await Story.findAll({
            where: { user_id: parseInt(user_id) } // Convert user_id to integer
        });

        if (!stories.length) {
            return res.status(404).json({ message: 'No stories found for this user' });
        }

        return res.status(200).json(stories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching stories' });
    }
};
// Get all stories for the authenticated user
const getStories = async (req, res) => {
    const user_id = req.user.userId; // Assuming you're using JWT for authentication

    try {
        // Fetch all stories for the authenticated user
        
        const stories = await Story.findAll({
            // where: { user_id },
            // include: {
            //     model: User,
            //     attributes: ['user_id', 'username', 'profile_picture_url'] // Include user info for the story
            // }
        });

        return res.status(200).json({ stories });
    } catch (error) {
        console.error('Error fetching stories:', error);
        return res.status(500).json({ message: 'Error fetching stories', error: error.message });
    }
};

// Get a single story by its ID
const getStoryById = async (req, res) => {
    const { storyId } = req.params;

    try {
        // Find the story by its ID
        console.log('Fetching story with ID:', storyId);
        const story = await Story.findByPk(storyId
        //     , {
            // include: {
            //     model: User,
            //     attributes: ['user_id', 'username', 'profile_picture_url']
            // }
        // }
    );

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // Track the view if the viewer is authenticated
        // if (req.user) {
        //     const viewerUserId = req.user.user_id;
        //     const existingView = await StoryView.findOne({
        //         where: {
        //             story_id,
        //             viewer_user_id: viewerUserId
        //         }
        //     });

        //     if (!existingView) {
        //         await StoryView.create({
        //             story_id,
        //             viewer_user_id: viewerUserId
        //         });
        //     }
        // }

        return res.status(200).json({ story });
    } catch (error) {
        console.error('Error fetching story:', error);
        return res.status(500).json({ message: 'Error fetching story', error: error.message });
    }
};

// Delete a story
const deleteStory = async (req, res) => {
    const { storyId } = req.params;
    const user_id = req.user.userId; // Assuming you're using JWT for authentication

    try {
        // Find the story by its ID
        const story = await Story.findByPk(storyId);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // Ensure the story belongs to the authenticated user
        if (story.user_id !== user_id) {
            return res.status(403).json({ message: 'You are not authorized to delete this story' });
        }

        // Delete the story
        await story.destroy();

        return res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.error('Error deleting story:', error);
        return res.status(500).json({ message: 'Error deleting story', error: error.message });
    }
};

// Get all views for a story
// const getStoryViews = async (req, res) => {
//     const { story_id } = req.params;

//     try {
//         // Find the story
//         const story = await Story.findByPk(story_id);
//         if (!story) {
//             return res.status(404).json({ message: 'Story not found' });
//         }

//         // Fetch all views for the story
//         const views = await StoryView.findAll({
//             where: { story_id },
//             include: {
//                 model: User,
//                 attributes: ['user_id', 'username', 'profile_picture_url'] // Include viewer info
//             }
//         });

//         return res.status(200).json({ views });
//     } catch (error) {
//         console.error('Error fetching story views:', error);
//         return res.status(500).json({ message: 'Error fetching story views', error: error.message });
//     }
// };

module.exports = {
    createStory,
    getStories,
    getStoryById,
    deleteStory,
    getStoryByUser
    // getStoryViews
};
