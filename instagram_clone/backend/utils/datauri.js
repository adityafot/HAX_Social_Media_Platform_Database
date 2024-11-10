const DatauriParser = require('datauri/parser');
const path = require('path');

const parser = new DatauriParser();

// Generates Data URI for file buffer (req.file.buffer) and ensures extension is valid
const dataUri = (req) => {
    const fileExt = path.extname(req.file.originalname).toString();
    if (!fileExt) {
        throw new Error('Invalid file extension');
    }
    return parser.format(fileExt, req.file.buffer);
};

module.exports = dataUri;
