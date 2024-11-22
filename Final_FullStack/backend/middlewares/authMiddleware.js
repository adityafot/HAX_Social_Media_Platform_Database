const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const dotenv = require('dotenv');

dotenv.config();

// Middleware to check if the user is authenticated
const authenticateJWT = (req, res, next) => {
    console.log(`hii`)
    const token = req.cookies.token;
    console.log(token)
    console.log(`hii`)
    if (!token) {
        console.log(req.cookies);
        return res.status(401).json({ message: 'Access denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;
