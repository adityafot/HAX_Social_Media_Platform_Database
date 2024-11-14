const express = require('express');
const router = express.Router();
const { getUserInfo, updateUserInfo, deleteUser, logoutUser, registerUser, loginUser, followUser } = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authMiddleware');
const { getUserFeed } = require('../controllers/feedController');
const { getNotifications } = require('../controllers/notificationController');

router.post('/register', registerUser);

// User login
router.post('/login', loginUser);


// Get user information (profile)
router.get('/profile', authenticateJWT, getUserInfo);

router.get('/feed', authenticateJWT, getUserFeed);

// Update user information (bio, profile picture)
router.put('/profile', authenticateJWT, updateUserInfo);

// Delete user account
router.delete('/profile', authenticateJWT, deleteUser);

// Logout user (clear JWT cookie)
router.post('/logout', authenticateJWT, logoutUser);

router.post('/followunfollow/:userId', authenticateJWT, followUser);

router.get('/notifications/:user_id', getNotifications);

module.exports = router;
