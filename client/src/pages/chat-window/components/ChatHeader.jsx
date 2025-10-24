import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatHeader = ({ contact, onBack }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Last seen recently';
    
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Active now';
    if (diffInMinutes < 60) return `Last seen ${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `Last seen ${Math.floor(diffInMinutes / 60)}h ago`;
    return `Last seen ${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        {/* Back Button (Mobile) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
          className="lg:hidden"
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>

        {/* Contact Info */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
              <Image
                src={contact?.avatar}
                alt={contact?.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online Status Indicator */}
            {contact?.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-card rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">
              {contact?.name || 'Unknown Contact'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {contact?.isOnline ? 'Active now' : formatLastSeen(contact?.lastSeen)}
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Video Call */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex"
        >
          <Icon name="Video" size={18} />
        </Button>

        {/* Voice Call */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex"
        >
          <Icon name="Phone" size={18} />
        </Button>

        {/* More Options */}
        <Button
          variant="ghost"
          size="icon"
        >
          <Icon name="MoreVertical" size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;