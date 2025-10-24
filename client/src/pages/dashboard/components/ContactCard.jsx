import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ContactCard = ({ contact, isActive, onClick, lastMessage, unreadCount }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-success';
      case 'away':
        return 'bg-warning';
      case 'busy':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'teacher':
        return 'GraduationCap';
      case 'admin':
        return 'Shield';
      default:
        return 'User';
    }
  };

  const formatLastMessageTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-border cursor-pointer transition-educational hover:bg-muted/50 ${
        isActive ? 'bg-accent/10 border-l-4 border-l-accent' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar with Status */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
            <Image
              src={contact?.avatar}
              alt={contact?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(contact?.status)}`}></div>
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-foreground truncate">{contact?.name}</h3>
              <Icon 
                name={getRoleIcon(contact?.role)} 
                size={14} 
                className="text-muted-foreground flex-shrink-0" 
              />
            </div>
            {lastMessage && (
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatLastMessageTime(lastMessage?.timestamp)}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground capitalize mb-1">{contact?.role}</p>
              {lastMessage && (
                <p className="text-sm text-muted-foreground truncate">
                  {lastMessage?.isOwn ? 'You: ' : ''}{lastMessage?.content}
                </p>
              )}
            </div>
            
            {unreadCount > 0 && (
              <div className="flex-shrink-0 ml-2">
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-accent rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;