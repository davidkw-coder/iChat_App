import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages = [], currentUserId, className = '' }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const shouldShowAvatar = (message, index, messages) => {
    if (index === messages?.length - 1) return true;
    
    const nextMessage = messages?.[index + 1];
    return nextMessage?.senderId !== message?.senderId;
  };

  const formatDateSeparator = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate?.toDateString() === today?.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);
    
    if (messageDate?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shouldShowDateSeparator = (message, index, messages) => {
    if (index === 0) return true;
    
    const prevMessage = messages?.[index - 1];
    const currentDate = new Date(message.timestamp)?.toDateString();
    const prevDate = new Date(prevMessage.timestamp)?.toDateString();
    
    return currentDate !== prevDate;
  };

  if (!messages?.length) {
    return (
      <div className={`flex-1 flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No messages yet</h3>
          <p className="text-muted-foreground">Start the conversation by sending a message!</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex-1 overflow-y-auto p-4 space-y-1 ${className}`}
    >
      {messages?.map((message, index) => (
        <React.Fragment key={message?.id || index}>
          {/* Date Separator */}
          {shouldShowDateSeparator(message, index, messages) && (
            <div className="flex items-center justify-center py-4">
              <div className="px-3 py-1 bg-muted rounded-full">
                <span className="text-xs text-muted-foreground font-medium">
                  {formatDateSeparator(message?.timestamp)}
                </span>
              </div>
            </div>
          )}
          
          {/* Message Bubble */}
          <MessageBubble
            message={message}
            isOwn={message?.senderId === currentUserId}
            showAvatar={shouldShowAvatar(message, index, messages)}
          />
        </React.Fragment>
      ))}
      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;