const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Unauthorized, BadRequest, NotFound } = require('http-errors');
const User = require('../models/user');

// Register new user
const registerUser = async (req, res, next) => {
    try {
        const { username, email, password, bio, profile_picture_url } = req.body;

        if (!username || !email || !password) {
            throw new BadRequest('Please provide all required fields: username, email, and password.');
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new BadRequest('Username is already taken.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password_hash: hashedPassword,
            bio: bio || '',
            profile_picture_url: profile_picture_url || '',
        });

        res.status(201).json({
            message: 'User registered successfully!',
            userId: newUser.user_id,
            username: newUser.username,
        });
    } catch (error) {
        next(error);
    }
};

// Login user
const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new BadRequest('Please provide both username and password.');
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new NotFound('User not found.');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Unauthorized('Invalid password.');
        }

        const token = jwt.sign({ userId: user.user_id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: 'Login successful!',
            token: token
        });
    } catch (error) {
        next(error);
    }
};

// Get user info
const getUserInfo = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            throw new NotFound('User not found.');
        }

        res.status(200).json({
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePictureUrl: user.profile_picture_url,
            createdAt: user.created_at
        });
    } catch (error) {
        next(error);
    }
};

// Update user info
const updateUserInfo = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { bio, profilePictureUrl } = req.body;

        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            throw new NotFound('User not found.');
        }

        user.bio = bio || user.bio;
        user.profile_picture_url = profilePictureUrl || user.profile_picture_url;

        await user.save();

        res.status(200).json({
            message: 'User information updated successfully.',
            user: {
                username: user.username,
                bio: user.bio,
                profilePictureUrl: user.profile_picture_url
            }
        });
    } catch (error) {
        next(error);
    }
};

// Delete user
const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            throw new NotFound('User not found.');
        }

        await user.destroy();

        res.status(200).json({
            message: 'User deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};

// Logout user (clear JWT token)
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserInfo,
    updateUserInfo,
    deleteUser
};
