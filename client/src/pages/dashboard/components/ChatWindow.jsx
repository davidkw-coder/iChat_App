import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ChatWindow = ({ 
  activeContact, 
  messages, 
  currentUser, 
  onSendMessage, 
  isTyping, 
  onTypingStart, 
  onTypingStop 
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef?.current) {
      messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Filter messages for active contact
  const contactMessages = messages?.filter(msg => 
    (msg?.senderId === activeContact?.id && msg?.receiverId === currentUser?.id) ||
    (msg?.senderId === currentUser?.id && msg?.receiverId === activeContact?.id)
  );

  const handleSendMessage = (content, type = 'text') => {
    if (!activeContact || !content?.trim()) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUser?.id,
      receiverId: activeContact?.id,
      content: content?.trim(),
      type,
      timestamp: new Date(),
      isRead: false
    };

    onSendMessage(newMessage);
  };

  const getContactStatus = () => {
    if (!activeContact) return null;
    
    switch (activeContact?.status) {
      case 'online':
        return { text: 'Online', color: 'text-success' };
      case 'away':
        return { text: 'Away', color: 'text-warning' };
      case 'busy':
        return { text: 'Busy', color: 'text-error' };
      default:
        return { text: 'Offline', color: 'text-muted-foreground' };
    }
  };

  if (!activeContact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background text-center p-8">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon name="MessageCircle" size={48} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Welcome to SchoolChat
        </h3>
        <p className="text-muted-foreground max-w-md">
          Select a contact from the list to start a conversation. Connect with your classmates, teachers, and school staff instantly.
        </p>
        <div className="mt-8 flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} />
            <span>Secure messaging</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} />
            <span>Real-time delivery</span>
          </div>
        </div>
      </div>
    );
  }

  const status = getContactStatus();

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
              <Image
                src={activeContact?.avatar}
                alt={activeContact?.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
              activeContact?.status === 'online' ? 'bg-success' : 
              activeContact?.status === 'away' ? 'bg-warning' : 
              activeContact?.status === 'busy' ? 'bg-error' : 'bg-muted'
            }`}></div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground">{activeContact?.name}</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground capitalize">{activeContact?.role}</p>
              {status && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className={`text-sm ${status?.color}`}>{status?.text}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Icon name="Phone" size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="Video" size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="MoreVertical" size={18} />
          </Button>
        </div>
      </div>
      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-background"
      >
        {contactMessages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Icon name="MessageSquare" size={32} className="text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">
              Start a conversation
            </h4>
            <p className="text-sm text-muted-foreground">
              Send a message to {activeContact?.name} to begin your conversation.
            </p>
          </div>
        ) : (
          <>
            {contactMessages?.map((message, index) => (
              <MessageBubble
                key={message?.id}
                message={message}
                isOwn={message?.senderId === currentUser?.id}
                showAvatar={
                  index === 0 || 
                  contactMessages?.[index - 1]?.senderId !== message?.senderId
                }
                contact={message?.senderId === currentUser?.id ? currentUser : activeContact}
              />
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={activeContact?.avatar}
                    alt={activeContact?.avatarAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
        disabled={!activeContact}
      />
    </div>
  );
};

export default ChatWindow;