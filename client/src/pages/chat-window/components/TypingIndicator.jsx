import React from 'react';

const TypingIndicator = ({ users = [] }) => {
  if (!users?.length) return null;

  const getTypingText = () => {
    if (users?.length === 1) {
      return `${users?.[0]} is typing...`;
    } else if (users?.length === 2) {
      return `${users?.[0]} and ${users?.[1]} are typing...`;
    } else {
      return `${users?.[0]} and ${users?.length - 1} others are typing...`;
    }
  };

  return (
    <div className="flex items-center space-x-2 px-4 py-2 text-muted-foreground">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm">{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicator;