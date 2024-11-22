import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link import
import axios from "axios";
import Cookies from "js-cookie";
// import { Link } from 'react-router-dom'; // Ensure you import Link

const UserProfile = () => {
  const { userId } = useParams(); // Destructuring userId from URL parameters
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user information
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get("token"); // Get token from cookies
        const response = await axios.get(
          `http://localhost:5152/api/users/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // To ensure cookies are sent along with the request
          }
        );
        setUser(response.data);
        setLoading(false); // Update user profile state
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const token = Cookies.get("token"); // Get token from cookies
        const response = await axios.get(
          `http://localhost:5152/api/posts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // To ensure cookies are sent along with the request
          }
        );
        setPosts(response.data.posts); // Update posts state
      } catch (error) {
        console.error("Error fetching user posts", error);
      }
    };

    const fetchSavedPosts = async () => {
      try {
        const token = Cookies.get("token"); // Get token from cookies
        const response = await axios.get(
          `http://localhost:5152/api/users/saved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // To ensure cookies are sent along with the request
          }
        );
        console.log(`ktyxc`);
        setSavedPosts(response.data); // Update saved posts state
      } catch (error) {
        // console.log(response)
        console.error("Error fetching saved posts", error);
      }
    };

    const checkIfFollowing = async () => {
      try {
        const token = Cookies.get("token");
        const userIdFromCookies = Cookies.get("userId");

        // Check if the current user is following the profile user
        const response = await axios.get(
          `http://localhost:5152/api/users/is-following/${userIdFromCookies}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // To ensure cookies are sent along with the request
          }
        );
        setIsFollowing(response.data.isFollowing); // Update follow status
      } catch (error) {
        console.error("Error checking follow status", error);
      }
    };

    // Fetch the user data
    fetchUserProfile();
    fetchUserPosts();
    fetchSavedPosts();
    checkIfFollowing();
  }, [userId]); // Re-run the effect if userId changes

  // Follow/unfollow user
  const handleFollow = async () => {
    try {
      const token = Cookies.get("token"); // Get token from cookies
      const response = await axios.post(
        `http://localhost:5152/api/users/followunfollow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // To ensure cookies are sent along with the request
        }
      );
      setIsFollowing(response.data.isFollowing); // Toggle follow status
    } catch (error) {
      console.error("Error following/unfollowing user", error);
    }
  };

  // If still loading or no user data, return loading state
  if (loading || !user) {
    return <div>Loading...</div>;
  }

  // If the logged-in user is viewing their own profile, don't show the follow button
  const isOwnProfile = userId === user.id;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-8">
        <img
          src={user.profile_picture_url || "/default-profile.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full mr-6"
        />
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <p className="text-gray-500">{user.fullname || "naam nhi h ji"}</p>
          <p className="text-gray-700 mt-2">{user.bio || ""}</p>

          {/* Follow/unfollow button
          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              className={`mt-4 px-4 py-2 rounded-md text-white ${
                isFollowing ? "bg-gray-400" : "bg-blue-500"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )} */}
        </div>
      </div>

      {/* Create Post button */}
      {!isOwnProfile && (
        <div className="flex justify-end mb-4">
          <Link to="/create/post">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Create Post
            </button>
          </Link>
        </div>
      )}
      <div className="flex justify-end mb-4">
        <Link to="/create/story">
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Create Story
          </button>
        </Link>
      </div>

      {/* Posts */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold">Posts</h3>
        <div className="grid grid-cols-3 gap-6 mt-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={post.resource_link}
                alt={post.caption}
                className="w-full h-48 object-cover"
              />
              <p className="p-2">{post.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Posts */}
      <div>
        <h3 className="text-xl font-semibold">Saved Posts</h3>
        <div className="grid grid-cols-3 gap-6 mt-4">
          {savedPosts.map((savedPost) => (
            <div
              key={savedPost.id}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={savedPost.resource_link}
                alt={savedPost.caption}
                className="w-full h-48 object-cover"
              />
              <p className="p-2">{savedPost.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
