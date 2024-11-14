const Notification = require('../models/notification');
const User = require('../models/user');

// Create a new notification
const createNotification = async (userId, type, referenceId = null) => {
    try {
        const notification = await Notification.create({
            user_id: userId,
            type: type,
            // reference_id: referenceId,
        });
        console.log('Created notification:', notification);
        await notification.save();
        return;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Get all notifications for a user
const getNotifications = async (req, res) => {
    const { user_id } = req.params;
    const userId = parseInt(user_id, 10);  // Convert the user_id to an integer

    try {
        console.log('Fetching notifications for user:', userId);
        
        const notifications = await Notification.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
        });

        console.log('Notifications count:', notifications.length);
        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};


// Mark a notification as read
// const markNotificationAsRead = async (notificationId) => {
//     try {
//         const notification = await Notification.findByPk(notificationId);
//         if (!notification) {
//             throw new Error('Notification not found');
//         }
//         notification.is_read = true;
//         await notification.save();
//         return notification;
//     } catch (error) {
//         console.error('Error marking notification as read:', error);
//         throw error;
//     }
// };

// Get unread notifications for a user
// const getUnreadNotifications = async (userId) => {
//     try {
//         const unreadNotifications = await Notification.findAll({
//             where: { user_id: userId, is_read: false },
//             order: [['created_at', 'DESC']],
//         });
//         return unreadNotifications;
//     } catch (error) {
//         console.error('Error fetching unread notifications:', error);
//         throw error;
//     }
// };

module.exports = { createNotification, getNotifications};
