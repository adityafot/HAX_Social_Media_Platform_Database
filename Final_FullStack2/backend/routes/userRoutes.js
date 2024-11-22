const express = require('express');
const router = express.Router();
const { getUserInfo, updateUserInfo, deleteUser, logoutUser, registerUser, loginUser, followUser, getUserInfo2 } = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authMiddleware');
const { getUserFeed } = require('../controllers/feedController');
const { getNotifications } = require('../controllers/notificationController');
const User = require('../models/user')
router.post('/register', registerUser);
const SavedPost = require('../models/savedPost');
const Follower = require('../models/follower');
const Post = require('../models/post')
const {Op} = require('sequelize');

// User login
router.post('/login', loginUser);


// Get user information (profile)
router.get('/profile', authenticateJWT, getUserInfo);

router.get('/profile/:user_id', getUserInfo2);

router.get('/feed', authenticateJWT, getUserFeed);

// Update user information (bio, profile picture)
router.put('/profile', authenticateJWT, updateUserInfo);

// Delete user account
router.delete('/profile', authenticateJWT, deleteUser);

// Logout user (clear JWT cookie)
router.post('/logout', authenticateJWT, logoutUser);

router.post('/followunfollow/:userId', authenticateJWT, followUser);

router.get('/notifications/:user_id', getNotifications);

router.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ message: "Query is required" });

    try {
        const users = await User.findAll({
            where: {
                username: { [Op.like]: `%${query}%` },
            },
            // attributes: ['user_id', 'username']
        });
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route to check follow status
router.get('/is-following/:userId', authenticateJWT, async (req, res) => {
    const currentUserId = req.user.userId;
    const { userId } = req.params;
  
    try {
      const isFollowing = await Follower.findOne({
        where: {
          user_id: userId,
          follower_user_id: currentUserId
        }
      });
      console.log('yhu')
      res.status(200).json({ isFollowing: !!isFollowing });
    } catch (error) {
      console.error('Error checking follow status', error);
      res.status(500).json({ message: 'Error checking follow status' });
    }
  });
  

router.get('/saved', authenticateJWT, async (req, res) => {
            try {
                // Step 1: Find all saved posts for the authenticated user
                const savedPosts = await SavedPost.findAll({
                  where: { user_id: req.user.userId }, // Assuming req.user.userId contains the authenticated user's ID
                  attributes: ['post_id'], // Fetch only the `post_id` fields
                });
            
                // Step 2: Extract post IDs from saved posts
                const postIds = savedPosts.map((savedPost) => savedPost.post_id);
            
                if (postIds.length === 0) {
                  // No saved posts, return empty array
                  return res.status(200).json([]);
                }
            
                // Step 3: Find all posts corresponding to the saved post IDs
                const posts = await Post.findAll({
                  where: { post_id: postIds }, // Filter by the saved post IDs
                  attributes: ['post_id', 'resource_link', 'caption'], // Return desired fields
                });
            
                // Step 4: Send the response with the fetched posts
                res.status(200).json(posts);
              } catch (error) {
                console.error('Error fetching saved posts:', error);
                res.status(500).json({ message: 'Failed to retrieve saved posts' });
              }
  });

  // Get the list of users the authenticated user is following
router.get('/following', authenticateJWT, async (req, res) => {
  const currentUserId = req.user.userId;

  try {
      const followingList = await Follower.findAll({
          where: { follower_user_id: currentUserId },
          include: [
              {
                  model: User,
                  as: 'following',
                  // attributes: ['user_id', 'username', 'profile_picture_url'], // Select desired fields
              },
          ],
      });

      const formattedFollowing = followingList.map(following => ({
          userId: following.following.user_id,
          username: following.following.username,
          // profilePictureUrl: following.following.profile_picture_url,
      }));

      res.status(200).json(formattedFollowing);
  } catch (error) {
      console.error('Error fetching following list:', error);
      res.status(500).json({ message: 'Failed to retrieve following list' });
  }
});


module.exports = router;
