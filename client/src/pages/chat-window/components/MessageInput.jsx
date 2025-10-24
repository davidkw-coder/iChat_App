import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageInput = ({ onSendMessage, onTyping, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '💯', '😎', '🤝', '👏', '🙏', '💪'];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !disabled) {
      onSendMessage({
        text: message?.trim(),
        timestamp: new Date(),
        type: 'text'
      });
      setMessage('');
      if (textareaRef?.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e?.target?.value);
    
    // Auto-resize textarea
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef?.current?.scrollHeight, 120) + 'px';
    }

    // Trigger typing indicator
    if (onTyping) {
      onTyping(e?.target?.value?.length > 0);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef?.current?.focus();
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file && onSendMessage) {
      // Mock file upload - in real app, you'd upload to server first
      const fileMessage = {
        attachment: {
          type: file?.type?.startsWith('image/') ? 'image' : 'file',
          name: file?.name,
          size: `${(file?.size / 1024)?.toFixed(1)} KB`,
          url: URL.createObjectURL(file),
          alt: `Shared file: ${file?.name}`
        },
        timestamp: new Date(),
        type: 'attachment'
      };
      onSendMessage(fileMessage);
    }
    // Reset file input
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 p-3 bg-popover border border-border rounded-lg shadow-educational-lg z-10">
          <div className="grid grid-cols-5 gap-2">
            {emojis?.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded transition-educational"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2 p-4 border-t border-border bg-card">
        {/* File Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef?.current?.click()}
          disabled={disabled}
          className="flex-shrink-0"
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
            placeholder="Type a message..."
            disabled={disabled}
            className="w-full min-h-[40px] max-h-[120px] px-4 py-2 pr-10 bg-muted border border-input rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-educational"
            rows={1}
          />
          
          {/* Emoji Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8"
          >
            <Icon name="Smile" size={16} />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          variant="default"
          size="icon"
          disabled={!message?.trim() || disabled}
          className="flex-shrink-0"
        >
          <Icon name="Send" size={18} />
        </Button>
      </form>
      {/* Overlay for emoji picker */}
      {showEmojiPicker && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};

export default MessageInput;