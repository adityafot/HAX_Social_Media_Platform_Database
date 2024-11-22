import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ChatPage = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [newChatUsername, setNewChatUsername] = useState('');  // State for username
    const [creatingChat, setCreatingChat] = useState(false);

    // Assuming userId is set properly in cookies (replace with actual user data)
    const userId = Cookies.get("userId");

    // Function to get the token from cookies
    const getToken = () => {
        const token = Cookies.get("token");
        if (!token) {
            console.error("No token found");
            throw new Error("No token found");
        }
        return token;
    };

    // Fetch user's chats on initial load
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = getToken(); // Get token from cookies
                const response = await axios.get(`http://localhost:5152/api/chats/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,  // Allow credentials for CORS
                });
                setChats(response.data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchChats();
        } else {
            console.error("User ID not found");
        }
    }, [userId]);

    // Select chat and fetch messages
    const selectChat = (chatId) => {
        setSelectedChat(chatId);
        const fetchMessages = async () => {
            try {
                const token = getToken();
                const response = await axios.get(`http://localhost:5152/api/chats/${chatId}/messages`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (chatId) {
            fetchMessages();
        }
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const token = getToken();
            const response = await axios.post(`http://localhost:5152/api/chats/${selectedChat}/message`, 
                { message: newMessage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Handle starting a new chat
    const handleStartNewChat = async () => {
        if (!newChatUsername.trim()) {
            alert("Please enter a valid username.");
            return;
        }

        setCreatingChat(true);

        try {
            const token = getToken();
            const response = await axios.post(`http://localhost:5152/api/chats/start`, 
                { username: newChatUsername },  // Send only the username
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            // Add the new chat to the chat list
            setChats((prevChats) => [response.data.chat, ...prevChats]);
            setNewChatUsername('');  // Clear username after creating the chat
        } catch (error) {
            console.error('Error starting new chat:', error);
        } finally {
            setCreatingChat(false);
        }
    };

    // Function to determine message styles
    const getMessageClass = (senderUserId) => {
        return senderUserId == userId 
            ? 'bg-green-400 text-right' 
            : 'bg-gray-200 text-left';
    };

    return (
        <div className="flex gap-8 p-4">
            {/* Chat List Section */}
            <div className="flex-1 p-4 border-r border-gray-300">
                <h2 className="text-xl font-semibold mb-4">Your Chats</h2>
                {loading ? (
                    <p>Loading chats...</p>
                ) : (
                    chats.length > 0 ? (
                        chats.map(chat => (
                            <div 
                                key={chat.chat_id} 
                                onClick={() => selectChat(chat.chat_id)}
                                className="cursor-pointer p-3 mb-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                            >
                                <p className="font-medium text-sm">{`Chat with ${chat.user1_id} & ${chat.user2_id}`}</p>
                                <p className="text-sm text-gray-500">{`Started: ${new Date(chat.started_at).toLocaleString()}`}</p>
                            </div>
                        ))
                    ) : (
                        <p>No chats found</p>
                    )
                )}
            </div>

            {/* Start New Chat Section */}
            <div className="flex-1 p-4">
                <h2 className="text-xl font-semibold mb-4">Start a New Conversation</h2>
                <div className="flex space-x-3">
                    <input
                        type="text"
                        placeholder="Enter Username"
                        value={newChatUsername}
                        onChange={(e) => setNewChatUsername(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleStartNewChat}
                        disabled={creatingChat}
                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${creatingChat ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {creatingChat ? 'Creating...' : 'Start Chat'}
                    </button>
                </div>
            </div>

            {/* Chat Window Section */}
            {selectedChat && (
                <div className="flex-2 p-4">
                    <h2 className="text-2xl font-semibold mb-4">Chat</h2>
                    <div className="h-[400px] bg-gray-50 p-4 rounded-lg shadow-md overflow-y-auto mb-4">
                        {messages.length > 0 ? (
                            messages.map(msg => (
                                <div 
                                    key={msg.log_id} 
                                    className={`mb-2 p-2 rounded-lg`+`${getMessageClass(msg.sender_user_id)}`}
                                >
                                    <p>{msg.message}</p>
                                    <span className="text-xs text-gray-500">{new Date(msg.sent_at).toLocaleTimeString()}</span>
                                </div>
                            ))
                        ) : (
                            <p>No messages yet</p>
                        )}
                    </div>

                    {/* Message Input Section */}
                    <div className="flex items-center space-x-3">
                        <input 
                            type="text" 
                            value={newMessage} 
                            onChange={(e) => setNewMessage(e.target.value)} 
                            placeholder="Type a message" 
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            onClick={handleSendMessage} 
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
