const API_BASE_URL = 'https://backend.youware.com';

export const api = {
  // Auth endpoints
  getUserInfo: () => fetch(`${API_BASE_URL}/api/auth/user-info`),
  
  // User endpoints
  getUsers: () => fetch(`${API_BASE_URL}/api/users`),
  
  // Conversation endpoints
  getConversations: () => fetch(`${API_BASE_URL}/api/conversations`),
  createConversation: (participantId, type = 'direct') => 
    fetch(`${API_BASE_URL}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantId, type }),
    }),
  
  // Message endpoints
  getMessages: (conversationId) => 
    fetch(`${API_BASE_URL}/api/conversations/${conversationId}`),
  sendMessage: (conversationId, content) =>
    fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }),
  sendDirectMessage: (recipientId, content) =>
    fetch(`${API_BASE_URL}/api/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId, content }),
    }),
  
  // Typing and status endpoints
  setTypingIndicator: (conversationId, isTyping) =>
    fetch(`${API_BASE_URL}/api/typing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, isTyping }),
    }),
  setOnlineStatus: (isOnline) =>
    fetch(`${API_BASE_URL}/api/${isOnline ? 'online' : 'offline'}-status`, {
      method: 'PUT',
    }),
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};