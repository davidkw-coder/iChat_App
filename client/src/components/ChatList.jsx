import React from 'react';

const ChatList = ({ 
  conversations, 
  onSelectConversation, 
  currentConversationId 
}) => {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Conversation List */}
      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition ${
              currentConversationId === conversation.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              {conversation.other_user_avatar ? (
                <img
                  src={conversation.other_user_avatar}
                  alt={conversation.other_user_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(conversation.other_user_name)}
                </div>
              )}
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 truncate">
                  {conversation.name || conversation.other_user_name || 'Unknown'}
                </h3>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {formatTime(conversation.last_message_time)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 truncate">
                {conversation.type === 'group' ? 'Group Chat' : 'Direct Message'}
              </p>
              
              <p className="text-sm text-gray-500 truncate">
                {conversation.message_count ? `${conversation.message_count} messages` : 'No messages'}
              </p>
            </div>
          </div>
        ))}
        
        {conversations.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600 text-sm">Start a new conversation to begin chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;