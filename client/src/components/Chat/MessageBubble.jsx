import React from 'react';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';

const MessageBubble = ({ message }) => {
  const { user } = useAuth();
  const isSender = message.sender === user._id;

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow-md ${
          isSender
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.message}</p>
        <span className={`block text-xs mt-1 ${isSender ? 'text-blue-100' : 'text-gray-500 dark:text-gray-300'}`}>
          {moment(message.timestamp).fromNow()}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;