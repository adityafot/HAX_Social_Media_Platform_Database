import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm'; // Adjust the path to your LoginForm component
import SignUpForm from './components/SignUpForm'; // Adjust the path to your SignUpForm component
import UserHome from './components/UserHome';
import ChatPage from './components/ChatPage';
import CommentPage from './components/Comments';
import UserProfile from './components/UserProfile';
import OtherUserProfile from './components/OtherUserProfile';
import Notification from './components/Notification';
import CreatePost from './components/CreatePost';
import CreateStory from './components/CreateStory';
import GetStory from './components/GetStory';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/post/:postId/comments" element={<CommentPage />} />
          
          {/* Correcting the Route for Profile */}
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/oprofile/:userId" element={<OtherUserProfile />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/create/post" element={<CreatePost />} />
          <Route path="/create/story" element={<CreateStory />} />
          <Route path="/get/story" element={<GetStory />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
