import React from 'react';

const TypingIndicator = ({ senderName }) => {
  return (
    <div className="flex items-center p-2 text-gray-500 dark:text-gray-400">
      <div className="dot-pulse mr-2">
        <div className="bg-gray-400 dark:bg-gray-300"></div>
        <div className="bg-gray-400 dark:bg-gray-300"></div>
        <div className="bg-gray-400 dark:bg-gray-300"></div>
      </div>
      <span className="text-sm">{senderName} is typing...</span>

      {/* Basic CSS for dot-pulse animation */}
      <style jsx>{`
        .dot-pulse {
          display: flex;
          align-items: center;
        }
        .dot-pulse div {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin: 0 2px;
          animation: dot-pulse 1s infinite ease-in-out;
        }
        .dot-pulse div:nth-child(1) { animation-delay: -0.32s; }
        .dot-pulse div:nth-child(2) { animation-delay: -0.16s; }

        @keyframes dot-pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;