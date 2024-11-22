import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5152/api/users/login', formData); // Update with your backend login endpoint

      // Set cookie using js-cookie
      Cookies.set('token', response.data.token, {
        expires: 7, // 7 days
        path: '/',
        domain: window.location.hostname,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
      });
      Cookies.set('userId', response.data.userId, {
        expires: 7, // 7 days
        path: '/',
        domain: window.location.hostname,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
      });

      // Verify cookie is set
      if (!Cookies.get('token')) {
        throw new Error('Failed to set cookie');
      }

      alert('Login successful!');
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Log In</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-500 hover:text-blue-600">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
