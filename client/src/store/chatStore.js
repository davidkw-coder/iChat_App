import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useChatStore = create((set, get) => ({
  socket: null,
  conversations: [],
  currentConversation: null,
  messages: [],
  users: [],
  onlineUsers: [],
  typingUsers: {},
  isLoadingMessages: false,
  
  initializeSocket: () => {
    const socket = io('https://backend.youware.com', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      get().updateOnlineStatus(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      get().updateOnlineStatus(false);
    });

    socket.on('new_message', (message) => {
      const { currentConversation, messages } = get();
      if (currentConversation && message.conversation_id === currentConversation.id) {
        set({ messages: [...messages, message] });
      }
      get().loadConversations();
    });

    socket.on('typing_indicator', ({ userId, isTyping, conversationId }) => {
      const { currentConversation, typingUsers } = get();
      if (currentConversation && conversationId === currentConversation.id) {
        set({ 
          typingUsers: { 
            ...typingUsers, 
            [userId]: isTyping 
          } 
        });
      }
    });

    socket.on('user_online', (userId) => {
      const { onlineUsers } = get();
      if (!onlineUsers.includes(userId)) {
        set({ onlineUsers: [...onlineUsers, userId] });
      }
    });

    socket.on('user_offline', (userId) => {
      const { onlineUsers } = get();
      set({ onlineUsers: onlineUsers.filter(id => id !== userId) });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  loadConversations: async () => {
    try {
      const response = await fetch('https://backend.youware.com/api/conversations');
      const data = await response.json();
      
      if (data.success) {
        set({ conversations: data.conversations });
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  },

  loadUsers: async () => {
    try {
      const response = await fetch('https://backend.youware.com/api/users');
      const data = await response.json();
      
      if (data.success) {
        set({ users: data.users });
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  },

  selectConversation: async (conversation) => {
    set({ currentConversation: conversation, isLoadingMessages: true });
    
    try {
      const response = await fetch(`https://backend.youware.com/api/conversations/${conversation.id}`);
      const data = await response.json();
      
      if (data.success) {
        set({ messages: data.messages, isLoadingMessages: false });
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (content) => {
    const { currentConversation, socket, messages } = get();
    
    if (!currentConversation) return;

    try {
      const response = await fetch(`https://backend.youware.com/api/conversations/${currentConversation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        set({ messages: [...messages, data.message] });
        
        if (socket) {
          socket.emit('send_message', {
            conversationId: currentConversation.id,
            message: data.message,
          });
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },

  sendDirectMessage: async (recipientId, content) => {
    try {
      const response = await fetch('https://backend.youware.com/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId, content }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const { socket } = get();
        if (socket) {
          socket.emit('send_message', {
            conversationId: data.conversationId,
            message: data.message,
          });
        }
        
        get().loadConversations();
      }
    } catch (error) {
      console.error('Failed to send direct message:', error);
    }
  },

  setTyping: (isTyping) => {
    const { currentConversation, socket } = get();
    
    if (!currentConversation || !socket) return;

    socket.emit('typing', {
      conversationId: currentConversation.id,
      isTyping,
    });

    // Also update server
    fetch('https://backend.youware.com/api/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        conversationId: currentConversation.id, 
        isTyping 
      }),
    });
  },

  updateOnlineStatus: async (isOnline) => {
    try {
      await fetch(`https://backend.youware.com/api/${isOnline ? 'online' : 'offline'}-status`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Failed to update online status:', error);
    }
  },
}));