import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ContactList from './components/ContactList';
import ChatWindow from './components/ChatWindow';
import NotificationToast from './components/NotificationToast';
import Icon from '../../components/AppIcon';


const Dashboard = () => {
  const navigate = useNavigate();
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showContactList, setShowContactList] = useState(true);

  // Mock current user data
  const currentUser = {
    id: "user_001",
    name: "Alex Johnson",
    email: "alex.johnson@school.edu",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1713456047082-4e844b81c494",
    avatarAlt: "Professional headshot of young man with brown hair wearing blue shirt smiling at camera",
    status: "online"
  };

  // Mock contacts data
  const contacts = [
  {
    id: "user_002",
    name: "Dr. Sarah Mitchell",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: "Professional headshot of middle-aged woman with blonde hair in navy blazer smiling confidently",
    status: "online"
  },
  {
    id: "user_003",
    name: "Michael Rodriguez",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1724128195747-dd25cba7860f",
    avatarAlt: "Professional headshot of Hispanic man with short black hair in navy suit",
    status: "away"
  },
  {
    id: "user_004",
    name: "Emma Thompson",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1668911240686-fe09797b3043",
    avatarAlt: "Professional headshot of young woman with long brown hair wearing white blouse",
    status: "online"
  },
  {
    id: "user_005",
    name: "Prof. James Wilson",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1714974528889-d51109fb6ae9",
    avatarAlt: "Professional headshot of middle-aged man with gray beard wearing dark suit jacket",
    status: "busy"
  },
  {
    id: "user_006",
    name: "Lisa Chen",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1668049221607-1f2df20621cc",
    avatarAlt: "Professional headshot of Asian woman with black hair in business attire smiling warmly",
    status: "online"
  },
  {
    id: "user_007",
    name: "David Park",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1610909810013-7c52994a153e",
    avatarAlt: "Professional headshot of young Asian man with black hair wearing casual shirt",
    status: "offline"
  },
  {
    id: "user_008",
    name: "Ms. Rachel Green",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1581961734784-e40d3eb9705b",
    avatarAlt: "Professional headshot of young woman with curly red hair wearing green sweater",
    status: "online"
  }];


  // Mock messages data
  const initialMessages = [
  {
    id: 1,
    senderId: "user_002",
    receiverId: "user_001",
    content: "Hi Alex! I wanted to discuss your recent assignment submission. Do you have a few minutes to chat?",
    type: "text",
    timestamp: new Date(Date.now() - 3600000),
    isRead: false,
    isDelivered: true
  },
  {
    id: 2,
    senderId: "user_001",
    receiverId: "user_002",
    content: "Hello Dr. Mitchell! Yes, I'm available now. Is there something specific you'd like to discuss about the assignment?",
    type: "text",
    timestamp: new Date(Date.now() - 3540000),
    isRead: true,
    isDelivered: true
  },
  {
    id: 3,
    senderId: "user_002",
    receiverId: "user_001",
    content: "Your analysis was excellent, but I think you could expand on the conclusion section. Would you like some specific feedback?",
    type: "text",
    timestamp: new Date(Date.now() - 3480000),
    isRead: false,
    isDelivered: true
  },
  {
    id: 4,
    senderId: "user_003",
    receiverId: "user_001",
    content: "Hey Alex! Are you free to work on the group project this afternoon? We need to finalize the presentation slides.",
    type: "text",
    timestamp: new Date(Date.now() - 1800000),
    isRead: false,
    isDelivered: true
  },
  {
    id: 5,
    senderId: "user_004",
    receiverId: "user_001",
    content: "Thanks for sharing your notes from yesterday\'s lecture! They were really helpful for understanding the complex concepts.",
    type: "text",
    timestamp: new Date(Date.now() - 900000),
    isRead: false,
    isDelivered: true
  }];


  // Initialize messages
  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setShowContactList(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle contact selection
  const handleContactSelect = useCallback((contact) => {
    setActiveContact(contact);

    // Mark messages as read
    setMessages((prev) => prev?.map((msg) =>
    msg?.senderId === contact?.id && msg?.receiverId === currentUser?.id ?
    { ...msg, isRead: true } :
    msg
    ));

    // Hide contact list on mobile when chat is opened
    if (isMobileView) {
      setShowContactList(false);
    }
  }, [currentUser?.id, isMobileView]);

  // Handle sending messages
  const handleSendMessage = useCallback((newMessage) => {
    setMessages((prev) => [...prev, newMessage]);

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) => prev?.map((msg) =>
      msg?.id === newMessage?.id ?
      { ...msg, isDelivered: true } :
      msg
      ));
    }, 1000);

    // Simulate read receipt
    setTimeout(() => {
      setMessages((prev) => prev?.map((msg) =>
      msg?.id === newMessage?.id ?
      { ...msg, isRead: true } :
      msg
      ));
    }, 3000);
  }, []);

  // Handle typing indicators
  const handleTypingStart = useCallback(() => {
    setIsTyping(true);
  }, []);

  const handleTypingStop = useCallback(() => {
    setIsTyping(false);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {// 30% chance every 10 seconds
        const randomContact = contacts?.[Math.floor(Math.random() * contacts?.length)];
        const incomingMessages = [
        "Hey! How\'s your day going?",
        "Did you see the announcement about tomorrow\'s class?",
        "I have a question about the homework assignment.",
        "Great job on your presentation today!",
        "Are you available for a quick study session?",
        "Thanks for your help with the project!"];


        const newMessage = {
          id: Date.now(),
          senderId: randomContact?.id,
          receiverId: currentUser?.id,
          content: incomingMessages?.[Math.floor(Math.random() * incomingMessages?.length)],
          type: "text",
          timestamp: new Date(),
          isRead: false,
          isDelivered: true
        };

        setMessages((prev) => [...prev, newMessage]);

        // Show notification if not currently chatting with this contact
        if (!activeContact || activeContact?.id !== randomContact?.id) {
          const notification = {
            id: Date.now(),
            senderName: randomContact?.name,
            message: newMessage?.content,
            avatar: randomContact?.avatar,
            avatarAlt: randomContact?.avatarAlt,
            timestamp: "now"
          };

          setNotifications((prev) => [...prev, notification]);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeContact, contacts, currentUser?.id]);

  // Handle notification close
  const handleNotificationClose = (notificationId) => {
    setNotifications((prev) => prev?.filter((n) => n?.id !== notificationId));
  };

  // Handle mobile back navigation
  const handleMobileBack = () => {
    setShowContactList(true);
    setActiveContact(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={currentUser}
        onLogout={handleLogout}
        className="md:pl-0" />

      <div className="pt-16 md:pt-20 h-screen flex">
        {/* Contact List Panel */}
        <div className={`${
        isMobileView ?
        showContactList ? 'w-full' : 'hidden' : 'w-80 flex-shrink-0'} h-full`
        }>
          <ContactList
            contacts={contacts}
            activeContactId={activeContact?.id}
            onContactSelect={handleContactSelect}
            messages={messages} />

        </div>

        {/* Chat Window Panel */}
        <div className={`${
        isMobileView ?
        showContactList ? 'hidden' : 'w-full' : 'flex-1'} h-full relative`
        }>
          {/* Mobile Back Button */}
          {isMobileView && activeContact &&
          <button
            onClick={handleMobileBack}
            className="absolute top-4 left-4 z-10 p-2 bg-card border border-border rounded-lg shadow-educational">

              <Icon name="ArrowLeft" size={20} />
            </button>
          }
          
          <ChatWindow
            activeContact={activeContact}
            messages={messages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop} />

        </div>
      </div>
      {/* Notifications */}
      {notifications?.map((notification) =>
      <NotificationToast
        key={notification?.id}
        notification={notification}
        onClose={() => handleNotificationClose(notification?.id)} />

      )}
    </div>);

};

export default Dashboard;