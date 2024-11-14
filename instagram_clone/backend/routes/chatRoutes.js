const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const messageController = require('../controllers/messageController');
const authenticateJWT = require('../middlewares/authMiddleware');

// Route to start a new chat between two users
router.post('/start',authenticateJWT, chatController.startChat);

// Route to get all chats for a user
router.get('/user/:user_id', chatController.getUserChats);

// Route to send a message in a chat
router.post('/:chat_id/message',authenticateJWT, messageController.sendMessage);

// Route to get all messages in a chat
router.get('/:chat_id/messages', messageController.getChatMessages);

module.exports = router;
