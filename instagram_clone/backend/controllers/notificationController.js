const Notification = require('../models/notification');
const User = require('../models/user');

// Create a new notification
const createNotification = async (userId, type, referenceId = null) => {
    try {
        const notification = await Notification.create({
            user_id: userId,
            type: type,
            reference_id: referenceId,
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Get all notifications for a user
const getNotifications = async (userId) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
        });
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

// Mark a notification as read
const markNotificationAsRead = async (notificationId) => {
    try {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.is_read = true;
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

// Get unread notifications for a user
const getUnreadNotifications = async (userId) => {
    try {
        const unreadNotifications = await Notification.findAll({
            where: { user_id: userId, is_read: false },
            order: [['created_at', 'DESC']],
        });
        return unreadNotifications;
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
        throw error;
    }
};

module.exports = { createNotification, getNotifications, markNotificationAsRead, getUnreadNotifications };
