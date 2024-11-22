import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';

const GetStory = () => {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:5152/api/stories/user', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      setStories(response.data.stories);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories');
      setLoading(false);
    }
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStory(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stories List */}
      <div className="flex overflow-x-auto gap-4 p-4 bg-white rounded-lg shadow-sm mb-6">
        {stories.length === 0 ? (
          <div className="text-gray-500 text-center w-full py-4">
            No stories available
          </div>
        ) : (
          stories.map((story) => (
            <div
              key={story.story_id}
              onClick={() => handleStoryClick(story)}
              className="flex flex-col items-center cursor-pointer min-w-[80px]"
            >
              <div className="w-16 h-16 rounded-full border-2 border-blue-500 p-1 mb-1">
                <img
                  src={story.resource_link || '/api/placeholder/64/64'}
                  alt="Story thumbnail"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-xs text-gray-600 truncate w-full text-center">
                {new Date(story.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Story Modal */}
      {showModal && selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg overflow-hidden">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-purple-950 z-10"
            >
              <X size={24} />
            </button>

            {/* Story content */}
            <div className="relative">
              <img
                src={selectedStory.resource_link}
                alt="Story"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              {selectedStory.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <p className="text-white text-sm">
                    {selectedStory.caption}
                  </p>
                </div>
              )}
              {selectedStory.user_id && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <p className="text-white text-sm">
                    {selectedStory.user_id}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStory;
