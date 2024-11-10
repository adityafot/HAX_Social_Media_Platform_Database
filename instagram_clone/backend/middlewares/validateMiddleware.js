const { validationResult } = require('express-validator');
const createError = require('http-errors');

const validateMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Collect all errors and return them with a 400 Bad Request status
        const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));
        return next(createError.BadRequest(JSON.stringify({ errors: extractedErrors })));
    }

    next();
};

module.exports = validateMiddleware;
