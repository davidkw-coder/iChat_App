import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop, disabled }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔'
  ];

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setMessage(value);

    // Handle typing indicators
    if (value?.trim() && onTypingStart) {
      onTypingStart();
      
      // Clear existing timeout
      if (typingTimeoutRef?.current) {
        clearTimeout(typingTimeoutRef?.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        if (onTypingStop) onTypingStop();
      }, 1000);
    } else if (!value?.trim() && onTypingStop) {
      onTypingStop();
      if (typingTimeoutRef?.current) {
        clearTimeout(typingTimeoutRef?.current);
      }
    }

    // Auto-resize textarea
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef?.current?.scrollHeight, 120)}px`;
    }
  };

  const handleSendMessage = () => {
    if (!message?.trim() || disabled) return;

    onSendMessage(message);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Stop typing indicator
    if (onTypingStop) onTypingStop();
    if (typingTimeoutRef?.current) {
      clearTimeout(typingTimeoutRef?.current);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef?.current?.focus();
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      // In a real app, you would upload the file and get a URL
      const fileMessage = {
        type: 'file',
        content: URL.createObjectURL(file),
        fileName: file?.name,
        fileSize: `${(file?.size / 1024 / 1024)?.toFixed(1)} MB`
      };
      
      onSendMessage(fileMessage?.content, 'file');
    }
    e.target.value = '';
  };

  return (
    <div className="border-t border-border bg-card p-4">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">Choose an emoji</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(false)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
          <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto">
            {emojis?.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emoji)}
                className="text-lg hover:bg-background rounded p-1 transition-educational"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Message Input Area */}
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef?.current?.click()}
          disabled={disabled}
        >
          <Icon name="Paperclip" size={18} />
        </Button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Select a contact to start messaging..." : "Type a message..."}
            disabled={disabled}
            className="w-full min-h-[44px] max-h-[120px] px-4 py-3 pr-12 bg-background border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-educational"
            rows={1}
          />
          
          {/* Emoji Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="absolute right-2 bottom-2"
          >
            <Icon name="Smile" size={18} />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={!message?.trim() || disabled}
          size="icon"
          className="rounded-full"
        >
          <Icon name="Send" size={18} />
        </Button>
      </div>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default MessageInput;