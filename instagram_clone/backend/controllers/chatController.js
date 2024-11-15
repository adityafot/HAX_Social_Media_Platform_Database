const Chat = require('../models/chat');
const ChatLog = require('../models/chatLog');
const Sequelize = require('sequelize')

const startChat = async (req, res) => {
    console.log('Authenticated user:', req.user); 
    const user1_id = req.user?.userId;
    const { user2_id } = req.body;

    if (!user1_id) {
        return res.status(400).json({ message: 'User not authenticated' });
    }

    try {
        
        let chat = await Chat.findOne({
            where: {
                user1_id: Math.min(user1_id, user2_id),
                user2_id: Math.max(user1_id, user2_id),
            },
        });

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
