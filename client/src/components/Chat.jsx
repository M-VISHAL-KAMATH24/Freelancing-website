import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

const Chat = ({ apiUrl = 'https://freelancing-website-122.onrender.com' }) => {
  const { sellerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('sellerToken');
    if (!token) {
      setError('Please log in to access chat');
      navigate('/login');
      return;
    }

    // Fetch user or seller profile
    const fetchProfile = async () => {
      try {
        const endpoint = localStorage.getItem('userToken') ? '/api/auth/profile' : '/api/seller/auth/profile';
        const response = await fetch(`${apiUrl}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log('Profile Response:', response.status, data);
        if (response.ok) {
          setUser(data);
          setError('');
        } else {
          setError(data.message || 'Failed to load profile');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching profile:', error.message, error.stack);
        setError('Error loading profile');
        navigate('/login');
      }
    };

    // Fetch conversation messages or all conversations (for seller)
    const fetchMessages = async () => {
      try {
        const endpoint = localStorage.getItem('userToken')
          ? `/api/message/conversation/${sellerId}`
          : '/api/message/conversations';
        const response = await fetch(`${apiUrl}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log('Messages/Conversations Response:', response.status, data);
        if (response.ok) {
          if (localStorage.getItem('userToken')) {
            setMessages(data);
          } else {
            setConversations(data);
          }
          setError('');
        } else {
          setError(data.message || 'Failed to load messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error.message, error.stack);
        setError('Error loading messages');
      }
    };

    fetchProfile();
    fetchMessages();

    // Initialize Socket.IO
    const newSocket = io(apiUrl, {
      auth: { token },
      query: { role: localStorage.getItem('userToken') ? 'user' : 'seller' },
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [apiUrl, sellerId, navigate]);

  useEffect(() => {
    if (!socket || !user) return;

    // Join chat room for user or seller
    socket.emit('joinChat', {
      userId: user._id,
      sellerId: sellerId || user._id,
    });

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      console.log('Received Message:', message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, user, sellerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const isUser = localStorage.getItem('userToken');
      socket.emit('sendMessage', {
        senderId: user._id,
        receiverId: sellerId,
        content: newMessage,
        senderModel: isUser ? 'User' : 'Seller',
        receiverModel: isUser ? 'Seller' : 'User',
      });
      setNewMessage('');
      setError('');
    } catch (error) {
      console.error('Error sending message:', error.message, error.stack);
      setError(`Error sending message: ${error.message}`);
    }
  };

  const handleConversationClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (error) return <div className="text-red-500 p-6">{error}</div>;
  if (!user) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-semibold mb-6">
        {localStorage.getItem('userToken') ? 'Chat with Seller' : 'Conversations'}
      </h2>
      {localStorage.getItem('sellerToken') && !sellerId ? (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Your Conversations</h3>
          {conversations.length === 0 ? (
            <p>No conversations yet.</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.userId}
                onClick={() => handleConversationClick(conv.userId)}
                className="p-3 bg-gray-700 rounded-lg mb-2 cursor-pointer hover:bg-gray-600 transition duration-200"
              >
                <p><strong>{conv.userName}</strong></p>
                <p className="text-gray-400">{conv.lastMessage}</p>
                <p className="text-xs text-gray-400">
                  {new Date(conv.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md h-[70vh] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg max-w-[70%] ${
                  msg.senderId.toString() === user._id.toString()
                    ? 'bg-blue-600 ml-auto text-right'
                    : 'bg-gray-700 mr-auto'
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-200"
            >
              Send
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
      >
        Back
      </button>
    </div>
  );
};

export default Chat;