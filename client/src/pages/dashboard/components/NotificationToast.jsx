import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const NotificationToast = ({ notification, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto hide
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!notification) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-50 max-w-sm w-full bg-card border border-border rounded-lg shadow-educational-lg transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      onClick={handleClick}
    >
      <div className="p-4 cursor-pointer hover:bg-muted/50 transition-educational">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={notification?.avatar}
              alt={notification?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-foreground truncate">
                {notification?.senderName}
              </h4>
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  handleClick();
                }}
                className="text-muted-foreground hover:text-foreground transition-educational"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {notification?.message}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {notification?.timestamp}
              </span>
              <div className="flex items-center space-x-1">
                <Icon name="MessageCircle" size={12} className="text-primary" />
                <span className="text-xs text-primary">New message</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-linear"
          style={{
            width: isVisible ? '0%' : '100%',
            transition: `width ${duration}ms linear`
          }}
        />
      </div>
    </div>
  );
};

export default NotificationToast;