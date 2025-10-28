import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import UserList from '../components/UserList';
import Navbar from '../components/Navbar';

const Chat = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { 
    conversations, 
    currentConversation, 
    messages, 
    users, 
    onlineUsers, 
    typingUsers,
    isLoadingMessages,
    loadConversations, 
    loadUsers, 
    selectConversation 
  } = useChatStore();

  const [showUserList, setShowUserList] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadConversations();
    loadUsers();
  }, [user, loadConversations, loadUsers, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSelectConversation = (conversation) => {
    selectConversation(conversation);
    setShowUserList(false);
  };

  const handleStartChat = (userId) => {
    // This would create a new conversation
    setShowUserList(false);
  };

  const handleTyping = (value) => {
    const { setTyping } = useChatStore.getState();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setTyping(value.length > 0);

    if (value.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 1000);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={`${showUserList ? 'hidden' : 'block'} w-80 bg-white border-r border-gray-200 flex flex-col md:flex`}>
        <Navbar user={user} onLogout={handleLogout} onToggleUserList={() => setShowUserList(!showUserList)} />
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {showUserList ? (
            <UserList 
              users={users} 
              onlineUsers={onlineUsers}
              onSelectUser={handleStartChat}
            />
          ) : (
            <ChatList 
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              currentConversationId={currentConversation?.id}
            />
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <ChatWindow
            conversation={currentConversation}
            messages={messages}
            currentUser={user}
            typingUsers={typingUsers}
            onSendMessage={async (content) => {
              const { sendMessage } = useChatStore.getState();
              await sendMessage(content);
            }}
            onTyping={handleTyping}
            isLoading={isLoadingMessages}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to School Chat</h3>
              <p className="text-gray-600">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile User List Overlay */}
      {showUserList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <UserList 
              users={users} 
              onlineUsers={onlineUsers}
              onSelectUser={handleStartChat}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;