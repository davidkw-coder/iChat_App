import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const MessageBubble = ({ message, isOwn, showAvatar = true }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`flex items-end space-x-2 mb-4 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      {showAvatar && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
            <Image
              src={message?.avatar}
              alt={message?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      {/* Message Content */}
      <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name (only for received messages) */}
        {!isOwn && showAvatar && (
          <span className="text-xs text-muted-foreground mb-1 px-1">
            {message?.sender}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`relative px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          }`}
        >
          {/* Message Text */}
          {message?.text && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message?.text}
            </p>
          )}

          {/* File Attachment */}
          {message?.attachment && (
            <div className="mt-2">
              {message?.attachment?.type === 'image' && (
                <div className="rounded-lg overflow-hidden max-w-48">
                  <Image
                    src={message?.attachment?.url}
                    alt={message?.attachment?.alt}
                    className="w-full h-auto"
                  />
                </div>
              )}
              
              {message?.attachment?.type === 'file' && (
                <div className="flex items-center space-x-2 p-2 bg-background/10 rounded-lg">
                  <Icon name="FileText" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {message?.attachment?.name}
                    </p>
                    <p className="text-xs opacity-70">
                      {message?.attachment?.size}
                    </p>
                  </div>
                  <Icon name="Download" size={14} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message Footer */}
        <div className={`flex items-center space-x-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <span className="text-xs text-muted-foreground">
            {formatTime(message?.timestamp)}
          </span>
          
          {/* Read Receipt (only for sent messages) */}
          {isOwn && (
            <div className="flex items-center">
              {message?.status === 'sent' && (
                <Icon name="Check" size={12} className="text-muted-foreground" />
              )}
              {message?.status === 'delivered' && (
                <div className="flex">
                  <Icon name="Check" size={12} className="text-muted-foreground -mr-1" />
                  <Icon name="Check" size={12} className="text-muted-foreground" />
                </div>
              )}
              {message?.status === 'read' && (
                <div className="flex">
                  <Icon name="Check" size={12} className="text-primary -mr-1" />
                  <Icon name="Check" size={12} className="text-primary" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);