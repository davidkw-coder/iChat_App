import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import ConnectionStatus from './components/ConnectionStatus';

const ChatWindow = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get contact from navigation state or use default
  const contactFromState = location?.state?.contact;

  // Mock current user data
  const currentUser = {
    id: "user_001",
    name: "Alex Johnson",
    email: "alex.johnson@school.edu",
    avatar: "https://images.unsplash.com/photo-1676618228406-5513fe6a194a",
    avatarAlt: "Professional headshot of young man with brown hair in casual shirt smiling at camera"
  };

  // Mock contact data
  const defaultContact = {
    id: "teacher_001",
    name: "Ms. Sarah Wilson",
    email: "sarah.wilson@school.edu",
    role: "Mathematics Teacher",
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: "Professional headshot of middle-aged woman with blonde hair in blue blazer smiling warmly",
    isOnline: true,
    lastSeen: new Date(Date.now() - 300000) // 5 minutes ago
  };

  const [contact] = useState(contactFromState || defaultContact);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Mock messages data
  const mockMessages = [
  {
    id: "msg_001",
    senderId: "teacher_001",
    sender: "Ms. Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: "Professional headshot of middle-aged woman with blonde hair in blue blazer smiling warmly",
    text: "Good morning Alex! I hope you\'re ready for today\'s algebra quiz. Remember to show all your work for partial credit.",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: "read"
  },
  {
    id: "msg_002",
    senderId: "user_001",
    sender: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1676618228406-5513fe6a194a",
    avatarAlt: "Professional headshot of young man with brown hair in casual shirt smiling at camera",
    text: "Good morning Ms. Wilson! Yes, I've been studying. I have a question about quadratic equations though.",
    timestamp: new Date(Date.now() - 3540000), // 59 minutes ago
    status: "read"
  },
  {
    id: "msg_003",
    senderId: "teacher_001",
    sender: "Ms. Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: "Professional headshot of middle-aged woman with blonde hair in blue blazer smiling warmly",
    text: "Of course! What specifically are you having trouble with? Is it the factoring method or the quadratic formula?",
    timestamp: new Date(Date.now() - 3480000), // 58 minutes ago
    status: "read"
  },
  {
    id: "msg_004",
    senderId: "user_001",
    sender: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1676618228406-5513fe6a194a",
    avatarAlt: "Professional headshot of young man with brown hair in casual shirt smiling at camera",
    text: "It\'s the factoring method. I get confused when there\'s no obvious common factor.",
    timestamp: new Date(Date.now() - 3420000), // 57 minutes ago
    status: "read"
  },
  {
    id: "msg_005",
    senderId: "teacher_001",
    sender: "Ms. Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: "Professional headshot of middle-aged woman with blonde hair in blue blazer smiling warmly",
    text: `That's a great question! Let me share a helpful resource with you. When there's no obvious common factor, you need to look for two numbers that multiply to give you 'ac' and add to give you 'b'.\n\nFor example: x² + 5x + 6\nHere a=1, b=5, c=6\nSo ac = 6, and we need two numbers that multiply to 6 and add to 5.\nThose numbers are 2 and 3!\n\nSo we can factor as: (x + 2)(x + 3)`,
    timestamp: new Date(Date.now() - 3300000), // 55 minutes ago
    status: "read"
  },
  {
    id: "msg_006",
    senderId: "teacher_001",
    sender: "Ms. Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: "Professional headshot of middle-aged woman with blonde hair in blue blazer smiling warmly",
    attachment: {
      type: "file",
      name: "Quadratic_Factoring_Guide.pdf",
      size: "245.7 KB",
      url: "#",
      alt: "PDF document containing quadratic factoring examples and practice problems"
    },
    text: "Here\'s a comprehensive guide with more examples. Review this before the quiz!",
    timestamp: new Date(Date.now() - 3240000), // 54 minutes ago
    status: "read"
  },
  {
    id: "msg_007",
    senderId: "user_001",
    sender: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1676618228406-5513fe6a194a",
    avatarAlt: "Professional headshot of young man with brown hair in casual shirt smiling at camera",
    text: "Thank you so much! That explanation really helps. I\'ll practice with the guide you shared.",
    timestamp: new Date(Date.now() - 3180000), // 53 minutes ago
    status: "read"
  },
  {
    id: "msg_008",
    senderId: "user_001",
    sender: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1676618228406-5513fe6a194a",
    avatarAlt: "Professional headshot of young man with brown hair in casual shirt smiling at camera",
    attachment: {
      type: "image",
      url: "https://images.unsplash.com/photo-1670231598032-9db78083d8e2",
      alt: "Handwritten math notes showing quadratic equation practice problems with step-by-step solutions"
    },
    text: "I worked through some practice problems. Could you check if my approach is correct?",
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    status: "delivered"
  },
  {
    id: "msg_009",
    senderId: "teacher_001",
    sender: "Ms. Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: "Professional headshot of middle-aged woman with blonde hair in blue blazer smiling warmly",
    text: "Excellent work Alex! Your approach is absolutely correct. I can see you understand the concept well. You\'re ready for the quiz! 👍",
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    status: "read"
  }];


  // Initialize messages
  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  // Mock Socket.IO connection simulation
  useEffect(() => {
    // Simulate connection events
    const connectionInterval = setInterval(() => {
      const shouldDisconnect = Math.random() < 0.05; // 5% chance of disconnection

      if (shouldDisconnect && isConnected) {
        setIsConnected(false);
        setIsReconnecting(true);

        // Simulate reconnection after 2-5 seconds
        setTimeout(() => {
          setIsConnected(true);
          setIsReconnecting(false);
        }, Math.random() * 3000 + 2000);
      }
    }, 10000);

    return () => clearInterval(connectionInterval);
  }, [isConnected]);

  // Mock typing simulation
  useEffect(() => {
    const typingInterval = setInterval(() => {
      const shouldShowTyping = Math.random() < 0.1; // 10% chance

      if (shouldShowTyping && contact?.isOnline) {
        setTypingUsers([contact?.name]);

        setTimeout(() => {
          setTypingUsers([]);
        }, 3000);
      }
    }, 15000);

    return () => clearInterval(typingInterval);
  }, [contact]);

  const handleSendMessage = useCallback((messageData) => {
    if (!isConnected) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id,
      sender: currentUser?.name,
      avatar: currentUser?.avatar,
      avatarAlt: currentUser?.avatarAlt,
      text: messageData?.text || '',
      attachment: messageData?.attachment || null,
      timestamp: messageData?.timestamp || new Date(),
      status: 'sent'
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) =>
      prev?.map((msg) =>
      msg?.id === newMessage?.id ?
      { ...msg, status: 'delivered' } :
      msg
      )
      );
    }, 1000);

    // Simulate message read
    setTimeout(() => {
      setMessages((prev) =>
      prev?.map((msg) =>
      msg?.id === newMessage?.id ?
      { ...msg, status: 'read' } :
      msg
      )
      );
    }, 3000);

    // Mock auto-reply from contact (occasionally)
    if (Math.random() < 0.3) {// 30% chance of auto-reply
      setTimeout(() => {
        const replies = [
        "Thanks for sharing that!",
        "I\'ll review this and get back to you.",
        "Great question! Let me think about that.",
        "That looks good to me!",
        "I appreciate you reaching out."];


        const replyMessage = {
          id: `msg_${Date.now()}_reply`,
          senderId: contact?.id,
          sender: contact?.name,
          avatar: contact?.avatar,
          avatarAlt: contact?.avatarAlt,
          text: replies?.[Math.floor(Math.random() * replies?.length)],
          timestamp: new Date(),
          status: 'read'
        };

        setMessages((prev) => [...prev, replyMessage]);
      }, 2000 + Math.random() * 3000);
    }
  }, [isConnected, currentUser, contact]);

  const handleTyping = useCallback((isTyping) => {
    // In real app, this would emit typing events via Socket.IO
    console.log('User typing:', isTyping);
  }, []);

  const handleBackToContacts = () => {
    navigate('/dashboard');
  };

  // Redirect if no contact data
  if (!contact) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Connection Status */}
      <ConnectionStatus
        isConnected={isConnected}
        isReconnecting={isReconnecting} />

      {/* Chat Header */}
      <ChatHeader
        contact={contact}
        onBack={handleBackToContacts} />

      {/* Messages Area */}
      <MessageList
        messages={messages}
        currentUserId={currentUser?.id}
        className="flex-1" />

      {/* Typing Indicator */}
      <TypingIndicator users={typingUsers} />
      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={!isConnected} />

    </div>);

};

export default ChatWindow;