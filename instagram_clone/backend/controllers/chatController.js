const Chat = require('../models/chat');
const ChatLog = require('../models/chatLog');
const Sequelize = require('sequelize')
// Start a new chat between two users
const startChat = async (req, res) => {
    console.log('Authenticated user:', req.user); // Check what is being set here
    const user1_id = req.user?.userId;
    const { user2_id } = req.body;

    if (!user1_id) {
        return res.status(400).json({ message: 'User not authenticated' });
    }

    try {
        // Ensure user2_id is a number
        // const parsedUser2Id = parseInt(user2_id, 10);
        // if (isNaN(parsedUser2Id)) {
        //     return res.status(400).json({ message: 'Invalid user2_id' });
        // }

        // Check if a chat already exists between the two users
        let chat = await Chat.findOne({
            where: {
                user1_id: Math.min(user1_id, user2_id),
                user2_id: Math.max(user1_id, user2_id),
            },
        });

        // If chat doesn't exist, create a new one
        if (!chat) {
            chat = await Chat.create({
                user1_id: Math.min(user1_id, user2_id),
                user2_id: Math.max(user1_id, user2_id),
            });
        }

        res.status(200).json({ message: 'Chat started', chat });
    } catch (error) {
        console.error('Error starting chat:', error);
        res.status(500).json({ message: 'Error starting chat', error: error.message });
    }
};


// Get all chats for a specific user
const getUserChats = async (req, res) => {
    const { user_id } = req.params;

    try {
        const chats = await Chat.findAll({
            where: {
                [Sequelize.Op.or]: [{ user1_id: user_id }, { user2_id: user_id }]
            },
            order: [['started_at', 'DESC']]
        });

        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching user chats:', error);
        res.status(500).json({ message: 'Error fetching user chats', error: error.message });
    }
};

module.exports = { startChat, getUserChats };
