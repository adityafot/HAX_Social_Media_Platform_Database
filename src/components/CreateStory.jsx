import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const CreateStory = () => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('file', file);

    try {
      const token = Cookies.get('token');
      const response = await axios.post('http://localhost:5152/api/stories/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        alert('Story created successfully!');
        navigate('/home'); // Navigate back to the profile page or wherever needed
      }
    } catch (error) {
      console.error('Error creating story:', error);
      setError('Failed to create story. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Story</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter a caption for your story"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Upload File</label>
          <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Story
        </button>
      </form>
    </div>
  );
};

export default CreateStory;
