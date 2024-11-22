const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.content, {
            resource_type: 'auto',
        });
        return result;
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

module.exports = uploadToCloudinary;
