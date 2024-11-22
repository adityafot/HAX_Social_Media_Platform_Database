import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "./PostCard";
import { FaTrash } from "react-icons/fa"; // Importing Trash icon
import Cookies from "js-cookie"; // Importing js-cookie for cookie management

const CommentPage = () => {
  const { postId } = useParams(); // Extract postId from the URL parameters
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Store the current user

  // Fetch the JWT token from localStorage or cookies
  const getAuthToken = () => {
    return localStorage.getItem("token") || Cookies.get("token") || ""; // Modify this if the token is stored elsewhere (cookies, etc.)
  };

  // Axios instance with Authorization header for JWT
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5152/api",  // Make sure this matches your backend URL
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    withCredentials: true,
  });

  // Fetch post details
  const fetchPostDetails = async () => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
      setPost(response.data.post);
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/comments/${postId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user (this is where you get the logged-in user's details)
  const fetchCurrentUser = async () => {
    try {
      const response = await axiosInstance.get("/users/me");
      setCurrentUser(response.data.user); // Assuming the backend returns the current user's info
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
      fetchComments();
      fetchCurrentUser(); // Fetch current user when component mounts
    }
  }, [postId]);

  // Add a new comment
  const addComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/comments/create", {
        post_id: postId,
        commented_text: newComment,
      });
      setComments((prev) => [response.data.comment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a comment
  const deleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/delete/${commentId}`);
      setComments((prev) =>
        prev.filter((comment) => comment.comment_id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Handle like toggle functionality
  const handleLikeToggle = async (postId, isLiked) => {
    try {
      const token = Cookies.get("token", {
        path: "/",
        domain: "localhost",
      });
      if (!token) throw new Error("No token found");

      // Send like/unlike request
      const response = await axiosInstance.post(
        `/posts/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Update the post's like count and toggle the liked state
        setPost((prevPost) => ({
          ...prevPost,
          likes_count: isLiked
            ? prevPost.likes_count - 1
            : prevPost.likes_count + 1, // Toggle like count
          liked: !isLiked, // Toggle the liked state
        }));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {post ? (
        <>
          {/* PostCard Section */}
          <PostCard
            username={post.username}
            imageUrl={post.resource_link}
            caption={post.caption}
            likesCount={post.likes_count}
            liked={post.liked}
            onLikeToggle={() => handleLikeToggle(post.post_id, post.liked)} // Pass the like toggle handler
            postId={post.post_id}
          />

          {/* Comments Section */}
          <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>

            {/* Add New Comment */}
            <div className="mb-4">
              <textarea
                className="w-full p-3 border rounded-md"
                rows="3"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button
                onClick={addComment}
                className={`mt-2 px-4 py-2 rounded-md text-white ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Comment"}
              </button>
            </div>

            {/* List of Comments */}
            {loading ? (
              <p>Loading comments...</p>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.comment_id} className="border-b pb-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.username}`}
                      alt={comment.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{comment.username}</p>
                      <p>{comment.commented_text}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    {/* Only show the delete button if the current user is the author of the comment */}
                    {currentUser && comment.user_id === currentUser.user_id && (
                      <button
                        onClick={() => deleteComment(comment.comment_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash /> {/* Add delete icon */}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading post details...</p>
      )}
    </div>
  );
};

export default CommentPage;
