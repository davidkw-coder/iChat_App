import React, { useState, useEffect, useRef } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import UserProfile from '../Common/UserProfile';

const ChatWindow = ({ selectedChat }) => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({}); // {userId: true}
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const receiverId = selectedChat?._id;
  const senderId = user?._id;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]); // Scroll when messages or typing status changes

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get(`/messages/${selectedChat._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    setTypingUsers({}); // Clear typing status when chat changes
  }, [selectedChat]);


  // Socket.IO listeners for real-time messages and typing indicators
  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on('receiveMessage', (message) => {
        // Only add message if it belongs to the current conversation
        if (
          (message.sender === senderId && message.receiver === receiverId) ||
          (message.sender === receiverId && message.receiver === senderId)
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });

      // Listen for typing events
      socket.on('typing', ({ senderId: typingSenderId }) => {
        if (typingSenderId === receiverId) {
          setTypingUsers((prev) => ({ ...prev, [typingSenderId]: true }));
        }
      });

      // Listen for stop typing events
      socket.on('stopTyping', ({ senderId: typingSenderId }) => {
        if (typingSenderId === receiverId) {
          setTypingUsers((prev) => {
            const newState = { ...prev };
            delete newState[typingSenderId];
            return newState;
          });
        }
      });

      // Cleanup socket listeners on unmount or dependency change
      return () => {
        socket.off('receiveMessage');
        socket.off('typing');
        socket.off('stopTyping');
      };
    }
  }, [socket, senderId, receiverId]); // Re-register listeners if chat partner changes

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const messagePayload = {
      senderId: user._id,
      receiverId: selectedChat._id,
      message: newMessage,
    };

    // Emit message via Socket.IO
    if (socket) {
      socket.emit('sendMessage', messagePayload);
    } else {
      // Fallback for non-realtime (e.g., if socket connection fails)
      // This part would typically not be used in a real-time app but is here for illustration.
      API.post('/messages', { receiverId: selectedChat._id, message: newMessage })
        .then((res) => setMessages((prev) => [...prev, res.data]))
        .catch((err) => console.error('Failed to send message via REST:', err));
    }

    setNewMessage('');
    // Inform others that sender stopped typing
    if (socket && isTyping) {
      socket.emit('stopTyping', { senderId: user._id, receiverId: selectedChat._id });
      setIsTyping(false);
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (socket && selectedChat && user) {
      if (!isTyping) {
        socket.emit('typing', { senderId: user._id, receiverId: selectedChat._id });
        setIsTyping(true);
      }

      // Clear previous timeout
      clearTimeout(typingTimeoutRef.current);

      // Set a new timeout to send 'stopTyping' after a delay
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', { senderId: user._id, receiverId: selectedChat._id });
        setIsTyping(false);
      }, 3000); // 3 seconds after last key stroke
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center">
        <UserProfile user={selectedChat} isOnline={onlineUsers.includes(selectedChat._id)} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading messages...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && messages.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No messages yet. Start a conversation!</p>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}
        {typingUsers[selectedChat._id] && <TypingIndicator senderName={selectedChat.name} />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-200 disabled:opacity-50"
          disabled={!newMessage.trim()}
        >
          <PaperAirplaneIcon className="h-6 w-6 transform rotate-90" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;