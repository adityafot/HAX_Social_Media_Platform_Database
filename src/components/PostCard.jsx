import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostCard = ({
  username,
  imageUrl,
  caption,
  likesCount,
  liked,
  saved,
  onLikeToggle,
  postId,
}) => {
  const [isSaved, setIsSaved] = useState(saved);
  const navigate = useNavigate();

  const handleCommentClick = () => {
    navigate(`/post/${postId}/comments`);
  };

  const handleSaveToggle = async () => {
    try {
      // Make the API call to save or unsave the post
      const response = await axios.post(
        `http://localhost:5152/api/posts/save/${postId}`,
        {},
        { withCredentials: true } // Assuming you're using JWT in cookies
      );

      // Only toggle if the request was successful
      if (response.status === 200) {
        setIsSaved((prevState) => !prevState); // Toggle saved state in UI
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  return (
    <div className="max-w-sm mx-auto my-8 bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${username}`}
          alt={username}
        />
        <h3 className="ml-3 font-semibold text-lg">{username}</h3>
      </div>

      {/* Image */}
      <img src={imageUrl} alt="Post" className="w-full h-64 object-cover" />

      {/* Caption */}
      {caption && <p className="p-4 text-gray-700 text-sm">{caption}</p>}

      {/* Actions */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={onLikeToggle}
          className={`flex items-center space-x-2 ${liked ? "text-red-500" : "text-gray-500"}`}
        >
          {/* Like Button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={liked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 19.879A3 3 0 012 17.757V11.34a3 3 0 011.172-2.343L12 2.937l8.828 6.06A3 3 0 0122 11.34v6.417a3 3 0 01-3.121 2.122H5.121z"
            />
          </svg>
          <span>{liked ? "Unlike" : "Like"}</span>
        </button>

        {/* Like Count */}
        <span className="text-gray-500">
          {likesCount} {likesCount === 1 ? "Like" : "Likes"}
        </span>

        {/* Comment Button */}
        <button
          onClick={handleCommentClick}
          className="flex items-center space-x-2 text-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 11.38V16a2 2 0 01-2 2H8l-5 5V6a2 2 0 012-2h9.38"
            />
          </svg>
          <span>Comment</span>
        </button>

        {/* Save Button */}
        <button
          onClick={handleSaveToggle}
          className={`flex items-center space-x-2 ${isSaved ? "text-yellow-500" : "text-gray-500"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isSaved ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21l-9-5 9-5 9 5-9 5z"
            />
          </svg>
          <span>{isSaved ? "Unsave" : "Save"}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
