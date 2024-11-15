const { BadRequest, NotFound } = require("http-errors");
const Post = require("../models/post");
const SavedPost = require("../models/savedPost");
const PostLike = require("../models/postLike")
const User = require("../models/user");
const uploadToCloudinaryMiddleware = require("../middlewares/multer"); // Cloudinary upload middleware
const {createNotification} = require("./notificationController")
const createPost = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { caption, hashtags } = req.body;

    const newPost = await Post.create({
      user_id: userId,
      caption: caption || "",
      resource_link: null, // Placeholder for now
      hashtags: hashtags || [],
    });
    req.post_id = newPost.post_id;
    // if (req.file) {
    //     req.file.modelId = newPost.post_id; // Pass post_id to the middleware
    //     next(); // Move to uploadToCloudinaryMiddleware
    // } else {
    //     // If no file, respond immediately
    //     res.status(201).json({
    //         message: 'Post created successfully without image!',
    //         postId: newPost.post_id,
    //         caption: newPost.caption,
    //         imageUrl: null
    //     });
    // }
    next();
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { caption, hashtags } = req.body; 
    const { userId } = req.user;

    const post = await Post.findOne({
      where: { post_id: postId, user_id: userId },
    });

    // If the post doesn't exist or the user is not authorized, throw error
    if (!post) {
      return res
        .status(404)
        .json({
          message: "Post not found or you are not authorized to update it.",
        });
    }

    post.caption = caption || post.caption; 
    post.hashtags = hashtags || post.hashtags;

    await post.save();

    if (req.file) {
      const file = dataUri(req.file);
      const result = await uploadToCloudinary(file);

      if (!result || !result.secure_url) {
        return res.status(500).json({ message: "Cloudinary upload failed" });
      }

      post.resource_url = result.secure_url;
      await post.save();
    }

    res.status(200).json({
      message: "Post updated successfully.",
      post,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getPostsByUser = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const posts = await Post.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    if (!posts || posts.length === 0) {
      throw new NotFound("No posts found for this user.");
    }

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      order: [["created_at", "DESC"]],
    });

    if (!posts || posts.length === 0) {
      throw new NotFound("No posts found.");
    }

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ where: { post_id: postId } });

    if (!post) {
      throw new NotFound("Post not found.");
    }

    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;

    const post = await Post.findOne({
      where: { post_id: postId, user_id: userId },
    });

    if (!post) {
      throw new NotFound(
        "Post not found or you are not authorized to delete it."
      );
    }

    await post.destroy();

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// Controller for liking a post
const likePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.user;
  
      const post = await Post.findOne({ where: { post_id: postId } });
  
      if (!post) {
        throw new NotFound("Post not found.");
      }
      
      const existingLike = await PostLike.findOne({
        where: { post_id: postId, liked_by_user_id: userId },
      });
  
      if (existingLike) {
        return res.status(400).json({ message: "You've already liked this post." });
      }
  
      await PostLike.create({ post_id: postId, liked_by_user_id: userId });
      await createNotification(post.user_id, "like");
      post.likes_count += 1;
      await post.save();
  
      res.status(200).json({ message: "Post liked successfully." });
    } catch (error) {
      next(error);
    }
};

// Controller for saving a post
const savePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;

    // Fetch the post by postId
    const post = await Post.findOne({ where: { post_id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if the post has already been saved by the user
    const existingSave = await SavedPost.findOne({
      where: { post_id: postId, user_id: userId },
    });

    if (existingSave) {
      return res.status(400).json({ message: "Post already saved." });
    }

    await SavedPost.create({ post_id: post.post_id, user_id: userId });
    res.status(200).json({ message: "Post saved successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPostsByUser,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  savePost,
};
