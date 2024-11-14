const multer = require('multer');
const dataUri = require('../utils/datauri');
const uploadToCloudinary = require('../utils/cloudinary');
const Post = require('../models/post'); // Import Post model

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file'); // Multer setup to handle file upload

const uploadToCloudinaryMiddleware = async (req, res, next) => {
    if (!req.file) {
        console.log('No file uploaded');
        return next(); // Exit if no file is present
    }

    const file = dataUri(req.file);

    try {
        // Step 1: Upload the file to Cloudinary
        const result = await uploadToCloudinary(file);
        if (!result || !result.secure_url) {
            console.error('Error: Cloudinary upload failed');
            return res.status(500).json({ message: 'Cloudinary upload failed' });
        }

        // Step 2: Use req.post_id to update the post with the Cloudinary URL
        const updateResult = await Post.update(
            { resource_link: result.secure_url },
            { where: { post_id: req.post_id } }
        );

        console.log(`this is post_id ${req.post_id}`);  // Log the post_id to verify it's correct

        if (updateResult[0] === 0) {
            throw new Error('Failed to update post with Cloudinary URL');
        }

        // Send the final response ONLY if everything is successful
        return res.status(201).json({
            message: 'Post created successfully!',
            postId: req.post_id,
            imageUrl: result.secure_url
        });
    } catch (error) {
        console.error(`Error during file upload or URL update: ${error.message}`);
        // Ensure no further response is sent if an error occurs
        return next(error);
    }
};

module.exports = { uploadToCloudinaryMiddleware, upload };
