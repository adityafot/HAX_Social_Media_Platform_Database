const DatauriParser = require('datauri/parser');
const path = require('path');

const parser = new DatauriParser();

// Generates Data URI for file buffer and ensures extension is valid
const dataUri = (file) => {
    const fileExt = path.extname(file.originalname).toString();
    if (!fileExt) {
        throw new Error('Invalid file extension');
    }
    return parser.format(fileExt, file.buffer);
};

module.exports = dataUri;
