const Chat = require('../models/chat');
const User = require('../models/user'); // Assuming there's a User model to resolve usernames
const Sequelize = require('sequelize');

// Start a new chat or return an existing one
const startChat = async (req, res) => {
    const user1_id = req.user?.userId; // Authenticated user's ID
    
    console.log(user1_id)
    
    const { username } = req.body; // Frontend sends username instead of user ID
    console.log(`hiaiobd`)
    // Check if the user is authenticated
    if (!user1_id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate the username
    if (!username || username.trim() === '') {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        // Resolve the username to a user ID
        const user2 = await User.findOne({ where: { username } });
        if (!user2) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user2_id = user2.user_id;

        // Prevent creating a chat with oneself
        if (user1_id === user2_id) {
            return res.status(400).json({ message: 'You cannot start a chat with yourself' });
        }

        // Find or create the chat between the two users
        let chat = await Chat.findOne({
            where: {
                user1_id: Math.min(user1_id, user2_id),
                user2_id: Math.max(user1_id, user2_id),
            },
        });

        // If no chat is found, create a new one
        if (!chat) {
            chat = await Chat.create({
                user1_id: Math.min(user1_id, user2_id),
                user2_id: Math.max(user1_id, user2_id),
                started_at: new Date(), // Ensure `started_at` is set to the current time
            });
        }

        // Send a response with the chat details
        res.status(200).json({ message: 'Chat started', chat });
    } catch (error) {
        // Log the error and send a response with the error details
        console.error('Error starting chat:', error);
        res.status(500).json({ message: 'Error starting chat', error: error.message });
    }
};


// Get all chats for the authenticated user
const getUserChats = async (req, res) => {
    const userId = req.user?.userId; // Authenticated user's ID

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const chats = await Chat.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { user1_id: userId },
                    { user2_id: userId },
                ],
            },
            // include: [
            //     {
            //         model: User,
            //         as: 'user1',
            //         attributes: ['id', 'username'], // Include username for user1
            //     },
            //     {
            //         model: User,
            //         as: 'user2',
            //         attributes: ['id', 'username'], // Include username for user2
            //     },
            // ],
            order: [['started_at', 'DESC']],
        });

        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching user chats:', error);
        res.status(500).json({ message: 'Error fetching user chats', error: error.message });
    }
};

module.exports = { startChat, getUserChats };
