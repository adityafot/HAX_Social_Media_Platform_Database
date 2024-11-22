import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const userId = Cookies.get('userId'); // Get userId from cookies
      if (!userId) {
        setError('User ID is not available.');
        setLoading(false);
        return;
      }

      const token = Cookies.get('token'); // Get token from cookies
      if (!token) {
        setError('User token is not available.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5152/api/users/notifications/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response)
      if (response.status === 200) {
        setNotifications(response.data); // Set notifications data
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Error fetching notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications when component mounts
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {loading ? (
        <p>Loading notifications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.notification_id}
                className="border-b py-4"
              >
                <p>
                  <strong>{notification.type}</strong>
                  {notification.reference_id && (
                    <span className="text-gray-500">
                      {' '}
                      (ID: {notification.reference_id})
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  <em>Created at: {new Date(notification.created_at).toLocaleString()}</em>
                </p>
              </div>
            ))
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
