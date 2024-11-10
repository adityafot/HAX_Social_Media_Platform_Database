const express = require('express');
const router = express.Router();
const { getUserInfo, updateUserInfo, deleteUser, logoutUser, registerUser, loginUser } = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authMiddleware');

router.post('/register', registerUser);

// User login
router.post('/login', loginUser);


// Get user information (profile)
router.get('/profile', authenticateJWT, getUserInfo);

// Update user information (bio, profile picture)
router.put('/profile', authenticateJWT, updateUserInfo);

// Delete user account
router.delete('/profile', authenticateJWT, deleteUser);

// Logout user (clear JWT cookie)
router.post('/logout', authenticateJWT, logoutUser);

module.exports = router;
