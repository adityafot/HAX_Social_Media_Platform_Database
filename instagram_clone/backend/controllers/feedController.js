const { Op } = require('sequelize');
const Post = require('../models/post');
const User = require('../models/user');
const Follower = require('../models/follower'); // Add Follower model
const sequelize = require('../config/database');

const getUserFeed = async (req, res, next) => {
  const userId = req.user.userId;
  const pageSize = parseInt(req.query.pageSize, 10) || 20;
  const page = parseInt(req.query.page, 10) || 1;
  const trendingStartDays = parseInt(req.query.trendingStartDays, 10) || 10;

  try {
    if (!userId || typeof userId !== 'number' || userId <= 0) {
      throw new Error('Invalid user ID.');
    }

    const followedUserIds = await getFollowedUserIds(userId);

    const followedPosts = await Post.findAll({
      where: { user_id: followedUserIds },
      order: [['created_at', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(endTime.getDate() - trendingStartDays);

    const trendingPosts = await Post.findAll({
      where: {
        created_at: {
          [Op.between]: [startTime, endTime]
        }
      },
      order: [
        ['likes_count', 'DESC'],
        // ['comments_count', 'DESC']
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    //   include: [{
    //     model: User,
    //     attributes: ['user_id', 'username', 'profile_picture_url']
    //   }]
    });

    const combinedPosts = [...followedPosts, ...trendingPosts];
    const uniquePosts = removeDuplicates(combinedPosts, 'post_id');
    const followedPostIds = followedPosts.map(post => post.user_id);
    const trendingPostUserIds = trendingPosts.map(post => post.user_id);
    const allUserIds = [...followedPostIds, ...trendingPostUserIds];

    const users = await User.findAll({
      where: { user_id: allUserIds },
      attributes: ['user_id', 'username']
    });
    
    const userMap = users.reduce((acc, user) => ({ ...acc, [user.user_id]: user.username }), {});
        
    const feedData = uniquePosts.map(post => ({
      post_id: post.post_id,
      user_id: post.user_id,
      username: userMap[post.user_id],
    //   profile_picture_url: post.User.profile_picture_url,
      caption: post.caption,
      image_url: post.image_url,
      created_at: post.created_at,
      likes_count: post.likes_count,
    //   comments_count: post.comments_count
    }));

    res.status(200).json({ feed: feedData });
  } catch (error) {
    console.error('Error fetching feed:', error);
    next(error);
  }
};

const getFollowedUserIds = async (userId) => {
  const followers = await Follower.findAll({ where: { follower_user_id: userId } });
  return followers.map(follower => follower.user_id);
};

const removeDuplicates = (array, key) => {
  return array.filter((value, index, self) =>
    index === self.findIndex(t => t[key] === value[key])
  );
};

module.exports = { getUserFeed };