import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const MessageBubble = ({ message, isOwn, showAvatar, contact }) => {
  const formatMessageTime = (timestamp) => {
    const messageTime = new Date(timestamp);
    return messageTime?.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageContent = () => {
    switch (message?.type) {
      case 'image':
        return (
          <div className="max-w-xs">
            <Image
              src={message?.content}
              alt="Shared image in chat conversation"
              className="rounded-lg w-full h-auto"
            />
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg max-w-xs">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {message?.fileName || 'Document.pdf'}
              </p>
              <p className="text-xs text-muted-foreground">
                {message?.fileSize || '2.4 MB'}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="Download" size={16} />
            </Button>
          </div>
        );
      default:
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message?.content}
          </p>
        );
    }
  };

  return (
    <div className={`flex items-end space-x-2 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={contact?.avatar}
            alt={contact?.avatarAlt}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {/* Spacer when no avatar */}
      {!showAvatar && !isOwn && <div className="w-8"></div>}
      {/* Message Content */}
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          }`}
        >
          {renderMessageContent()}
        </div>
        
        {/* Message Info */}
        <div className={`flex items-center space-x-2 mt-1 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(message?.timestamp)}
          </span>
          
          {isOwn && (
            <div className="flex items-center space-x-1">
              {message?.isDelivered && (
                <Icon 
                  name="Check" 
                  size={12} 
                  className={message?.isRead ? 'text-primary' : 'text-muted-foreground'} 
                />
              )}
              {message?.isRead && (
                <Icon name="Check" size={12} className="text-primary -ml-1" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);