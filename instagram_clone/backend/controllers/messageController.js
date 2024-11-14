const ChatLog = require('../models/chatLog');
const Chat = require('../models/chat');

// Send a message in a chat
const sendMessage = async (req, res) => {
    const { chat_id } = req.params;
    const {  message } = req.body;
    const sender_user_id = req.user.userId;
    try {
        // Ensure the chat exists
        const chat = await Chat.findByPk(chat_id);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Create the message in ChatLog
        const newMessage = await ChatLog.create({
            chat_id,
            sender_user_id,
            message,
        });

        res.status(201).json({ message: 'Message sent', newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

// Get all messages for a specific chat
const getChatMessages = async (req, res) => {
    const { chat_id } = req.params;

    try {
        const messages = await ChatLog.findAll({
            where: { chat_id },
            order: [['sent_at', 'ASC']],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ message: 'Error fetching chat messages', error: error.message });
    }
};

module.exports = { sendMessage, getChatMessages };
