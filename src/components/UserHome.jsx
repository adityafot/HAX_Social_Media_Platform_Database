import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Importing js-cookie for cookie management
import { AiOutlineBell } from "react-icons/ai"; // Import bell icon from react-icons
import PostCard from "./PostCard"; // Assuming PostCard is a reusable component
import GetStory from './GetStory';

const UserHome = () => {
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch feed data
  const fetchFeed = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token", {
        path: "/",
        domain: "localhost",
      });
      console.log("Token value:", token);

      if (!token) throw new Error("No token found in cookies");

      // Send request to fetch feed
      const response = await axios.get("http://localhost:5152/api/users/feed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(`Error fetching feed. Status: ${response.status}`);
      }

      setFeed(response.data.feed);
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError(err.message || "Error fetching feed.");
    } finally {
      setLoading(false);
    }
  };

  // Search for users
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const token = Cookies.get("token"); // Get token from cookies
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `http://localhost:5152/api/users/search?query=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(response.data.users || []);
    } catch (err) {
      console.error("Error searching users:", err);
    }
  };

  // Like toggle handler
  const handleLikeToggle = async (postId, isLiked) => {
    try {
      const token = Cookies.get("token", {
        path: "/",
        domain: "localhost",
      });
      console.log("Token value:", token);
      if (!token) throw new Error("No token found");

      // Send like/unlike request
      const response = await axios.post(
        `http://localhost:5152/api/posts/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response);

      if (response.status === 200) {
        // Update the feed with the new like count and toggle the liked state
        setFeed((prevFeed) =>
          prevFeed.map((post) =>
            post.post_id === postId
              ? {
                  ...post,
                  likes_count: isLiked
                    ? post.likes_count - 1
                    : post.likes_count + 1, // Toggle like count
                  liked: !isLiked, // Toggle the liked state
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // Comment handler
  const handleComment = (postId) => {
    alert(`Redirecting to comments section for post ${postId}`);
    // Implement navigation logic to comment section if required
  };

  // Navigate to the user profile
  const handleGoToProfile = async () => {
    try {
      const token = Cookies.get("token"); // Get token from cookies
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:5152/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      const userId = Cookies.get("userId");
      navigate(`/profile/${userId}`); // Navigate to the user's profile
    } catch (err) {
      console.error("Error retrieving user profile:", err);
    }
  };

  // Log out
  const handleLogout = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        "http://localhost:5152/api/users/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        Cookies.remove("token"); // Clear token from cookies
        navigate("/login"); // Navigate to login page
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Feed</h1>
        <div>
          <button
            onClick={() => navigate("/notifications")} // Navigate directly to notifications
            className="px-4 py-2 bg-yellow-500 text-white rounded-md flex items-center gap-2 mr-4"
          >
            <AiOutlineBell size={20} />
            Notifications
          </button>
          <button
            onClick={handleGoToProfile} // On click, navigate to user profile
            className="px-4 py-2 bg-green-500 text-white rounded-md mr-4"
          >
            Go to Profile
          </button>
          <button
            onClick={handleLogout} // Log out button
            className="px-4 py-2 bg-red-500 text-white rounded-md mr-4"
          >
            Log Out
          </button>
          <button
            onClick={() => navigate("/chat")} // Chat button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Go to Chat
          </button>
        </div>
      </header>
      <GetStory />
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="w-full px-4 py-2 border rounded-md"
        />
        {searchResults.length > 0 && (
          <div className="bg-white border mt-2 rounded-md p-2">
            {searchResults.map((user) => (
              <div
                key={user.user_id}
                className="py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/oprofile/${user.user_id}`)} // Navigate to user profile
              >
                {user.username}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feed Section */}
      <div>
        {loading ? (
          <p>Loading feed...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          feed.map((post) => (
            <PostCard
              key={post.post_id}
              username={post.username}
              imageUrl={post.resource_link}
              caption={post.caption}
              likesCount={post.likes_count}
              postId={post.post_id}
              liked={post.liked} // Pass the liked state to PostCard
              onLikeToggle={() => handleLikeToggle(post.post_id, post.liked)} // Toggle like status
              onComment={() => handleComment(post.post_id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UserHome;
