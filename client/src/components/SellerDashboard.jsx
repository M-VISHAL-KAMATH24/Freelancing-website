import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import EditProfile from './EditProfile';
import ShowProfile from './ShowProfile';
import AddService from './AddService';
import ShowServices from './ShowServices';

const SellerDashboard = ({ apiUrl = 'https://freelancing-website-122.onrender.com' }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    console.log('Mobile Token Check:', token, 'API URL:', apiUrl, 'Platform:', navigator.userAgent);
    if (!token) {
      setError('No token found');
      navigate('/seller/login');
      return;
    }

    // Fetch seller profile
    const fetchSeller = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/seller/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'same-origin',
        });
        console.log('Mobile Response Status:', response.status, 'URL:', response.url, 'Headers:', response.headers);
        if (response.ok) {
          const data = await response.json();
          console.log('Mobile Seller Data:', data);
          setSeller(data);
          setError('');
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Network or server error' }));
          console.error('Mobile Error Data:', errorData);
          setError(errorData.message || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Mobile Fetch Error:', error.message, 'Stack:', error.stack, 'Code:', error.code);
        setError('Error loading profile. Please check network or log in again.');
      }
    };

    // Fetch all conversations for the seller
    const fetchConversations = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/message/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json(); // Read response body once
        console.log('Fetch Conversations Response:', response.status, data);
        if (response.ok) {
          setConversations(data);
          setError('');
        } else {
          console.error('Conversations Error Data:', data);
          setError(data.message || 'Failed to load conversations');
        }
      } catch (error) {
        console.error('Error fetching conversations:', error.message, error.stack);
        setError(`Error loading conversations: ${error.message}`);
      }
    };

    fetchSeller();
    fetchConversations();

    // Initialize Socket.IO
    const newSocket = io(apiUrl, {
      auth: { token },
      query: { role: 'seller' },
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [navigate, apiUrl]);

  useEffect(() => {
    if (!socket || !seller) return;

    // Join rooms for all conversations
    conversations.forEach((conv) => {
      const room = [seller._id, conv.userId].sort().join('-');
      socket.emit('joinChat', {
        userId: seller._id,
        sellerId: conv.userId,
      });
      console.log(`Seller ${seller._id} joined room ${room}`);
    });

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      if (message.senderId === selectedClientId || message.receiverId === selectedClientId) {
        setMessages((prev) => [...prev, message]);
      }
      // Update conversations with new message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.userId === message.senderId || conv.userId === message.receiverId
            ? { ...conv, lastMessage: message.content, timestamp: message.timestamp }
            : conv
        )
      );
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, seller, selectedClientId, conversations]);

  useEffect(() => {
    if (!selectedClientId) return;

    // Fetch messages for selected client
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/message/conversation/${selectedClientId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('sellerToken')}` },
        });
        const data = await response.json();
        console.log('Fetch Messages Response:', response.status, data);
        if (response.ok) {
          setMessages(data);
          setError('');
        } else {
          console.error('Messages Error Data:', data);
          setError(data.message || 'Failed to load messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error.message, error.stack);
        setError(`Error loading messages: ${error.message}`);
      }
    };

    fetchMessages();
  }, [selectedClientId, apiUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClientId) return;

    try {
      socket.emit('sendMessage', {
        senderId: seller._id,
        receiverId: selectedClientId,
        content: newMessage,
        senderModel: 'Seller',
        receiverModel: 'User',
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.message, error.stack);
      setError(`Error sending message: ${error.message}`);
    }
  };

  const handleSelectClient = (clientId) => {
    setSelectedClientId(clientId);
    setShowChat(true);
    setShowEditProfile(false);
    setShowProfile(false);
    setShowAddService(false);
    setShowServices(false);
  };

  if (!seller && !error) return <div className="text-white text-center p-6">Loading...</div>;
  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/seller/login')}
          className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav bg-gray-800">
        <div className="container mx-auto flex justify-between items-center p-4 space-x-4">
          <h1 className="text-2xl font-bold text-shadow text-white title">WorkVibe!!</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowChat(!showChat);
                setShowEditProfile(false);
                setShowProfile(false);
                setShowAddService(false);
                setShowServices(false);
                setSelectedClientId(null);
                setMessages([]);
              }}
              className="dashboard-button bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded transition duration-200"
            >
              Chat
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('sellerToken');
                navigate('/seller/login');
              }}
              className="dashboard-button bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="pt-20 pb-6 px-6">
        <h2 className="text-3xl font-semibold mb-6 text-white text-shadow title">Welcome, {seller.name}!</h2>
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => {
              setShowEditProfile(!showEditProfile);
              setShowProfile(false);
              setShowAddService(false);
              setShowServices(false);
              setShowChat(false);
              setSelectedClientId(null);
            }}
            className="dashboard-button flex-1 min-w-[120px]"
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowEditProfile(false);
              setShowAddService(false);
              setShowServices(false);
              setShowChat(false);
              setSelectedClientId(null);
            }}
            className="dashboard-button bg-green-700 hover:bg-green-800 flex-1 min-w-[120px]"
          >
            Show Profile
          </button>
          <button
            onClick={() => {
              setShowAddService(!showAddService);
              setShowEditProfile(false);
              setShowProfile(false);
              setShowServices(false);
              setShowChat(false);
              setSelectedClientId(null);
            }}
            className="dashboard-button bg-purple-700 hover:bg-purple-800 flex-1 min-w-[120px]"
          >
            Add Service
          </button>
          <button
            onClick={() => {
              setShowServices(!showServices);
              setShowEditProfile(false);
              setShowProfile(false);
              setShowAddService(false);
              setShowChat(false);
              setSelectedClientId(null);
            }}
            className="dashboard-button bg-yellow-700 hover:bg-yellow-800 flex-1 min-w-[120px]"
          >
            Show Services
          </button>
        </div>
        <div className="dashboard-section">
          {showEditProfile && <EditProfile seller={seller} setSeller={setSeller} />}
          {showProfile && <ShowProfile seller={seller} />}
          {showAddService && <AddService />}
          {showServices && <ShowServices />}
          {showChat && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="bg-gray-800 p-4 rounded-lg shadow-md md:w-1/3">
                <h3 className="text-xl font-semibold mb-4 text-white">Conversations</h3>
                {conversations.length === 0 ? (
                  <p className="text-gray-400">No conversations yet.</p>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.userId}
                      onClick={() => handleSelectClient(conv.userId)}
                      className={`p-3 rounded-lg mb-2 cursor-pointer transition duration-200 ${
                        selectedClientId === conv.userId ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <p className="font-semibold">{conv.userName}</p>
                      <p className="text-gray-400 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(conv.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              {selectedClientId && (
                <div className="bg-gray-800 p-4 rounded-lg shadow-md md:w-2/3 flex flex-col h-[60vh]">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Chat with {conversations.find((conv) => conv.userId === selectedClientId)?.userName}
                  </h3>
                  <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-4 p-3 rounded-lg max-w-[70%] ${
                          msg.senderId.toString() === seller._id.toString()
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;