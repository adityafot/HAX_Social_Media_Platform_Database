const multer = require('multer');
const dataUri = require('../utils/datauri');
const uploadToCloudinary = require('../utils/cloudinary');
const storeUrl = require('../utils/storeUrl'); // Import the storeUrl function
const dotenv = require('dotenv');
dotenv.config();

// Multer storage setup (storing in memory to be sent to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file'); // Assuming the field name is 'file'

// Middleware to handle file upload, convert to Data URI, and upload to Cloudinary
const uploadToCloudinaryMiddleware = async (req, res, next) => {
    upload(req, res, async (err) => {
        // Handle Multer errors (file size limit, no file uploaded, etc.)
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err.message });
        }

        // Ensure that a file is provided
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        // Convert the file to Data URI
        const file = dataUri(req.file); // Use `req.file` instead of `req`
        if (!file) {
            return res.status(400).json({ message: 'Error converting file to Data URI' });
        }

        // Validate modelId and modelType are present in the request body
        const { modelId, modelType } = req.body;
        if (!modelId || !modelType) {
            return res.status(400).json({ message: 'Model ID and model type are required' });
        }

        try {
            // Upload the file to Cloudinary
            const result = await uploadToCloudinary(file);

            // Store the URL in the relevant model (User, Post, Story)
            const storeResult = await storeUrl(result.secure_url, modelType, modelId);

            // Attach the uploaded file URL to the request object for further use
            req.fileUrl = storeResult.url; // This can now be used in subsequent request handlers

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error(`Error occurred during file upload or URL storage: ${error.message}`);
            return res.status(500).json({ message: 'Error processing file', error: error.message });
        }
    });
};

module.exports = uploadToCloudinaryMiddleware;
