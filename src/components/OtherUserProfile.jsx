import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const OtherUserProfile = () => {
  const { userId: otherUserId } = useParams(); // Get the other user's ID from URL parameters
  const myUserId = Cookies.get('userId'); // Get your own user ID from cookies
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!otherUserId) return; // Ensure `otherUserId` exists before making requests

    const fetchOtherUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5152/api/users/profile/${otherUserId}`, {
          withCredentials: true, // Ensure cookies are sent
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching other user profile', error);
        setLoading(false); // Ensure loading state updates on error
      }
    };

    const fetchUserPosts = async () => {
      try {
        const token = Cookies.get('token'); // Get token from cookies
        const response = await axios.get(`http://localhost:5152/api/posts/user/${otherUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching user posts', error);
      }
    };

    const checkIfFollowing = async () => {
      try {
        const token = Cookies.get('token'); // Get token from cookies
        const response = await axios.get(`http://localhost:5152/api/users/is-following/${otherUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error checking follow status', error);
      }
    };

    fetchOtherUserProfile();
    fetchUserPosts();
    checkIfFollowing();
  }, [otherUserId]);

  const handleFollow = async () => {
    try {
      const token = Cookies.get('token'); // Get token from cookies
      const response = await axios.post(
        `http://localhost:5152/api/users/followunfollow/${otherUserId}`,
        { followerId: myUserId }, // Send your user ID as the follower
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      // Toggle follow state based on the response
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error('Error following/unfollowing user', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message until data is ready
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-8">
        <img
          src={user.profilePictureUrl || '/default-profile.png'} // Assuming `user.profileImage` contains the profile image URL
          alt="Profile"
          className="w-32 h-32 rounded-full mr-6"
        />
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <p className="text-gray-500">{user.fullname || 'Name not available'}</p>
          <p className="text-gray-700 mt-2">{user.bio || 'No bio available'}</p>

          <button
            onClick={handleFollow}
            className={`mt-4 px-4 py-2 rounded-md text-white ${
              isFollowing ? 'bg-gray-400' : 'bg-blue-500'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold">Posts</h3>
        <div className="grid grid-cols-3 gap-6 mt-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={post.resource_link}
                  alt={post.caption}
                  className="w-full h-48 object-cover"
                />
                <p className="p-2">{post.caption}</p>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
