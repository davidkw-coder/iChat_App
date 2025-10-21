import React from 'react';

const UserProfile = ({ user, isOnline }) => {
  if (!user) return null;

  // Simple avatar generation based on first letter
  const getAvatarLetter = (name) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold bg-blue-500 dark:bg-blue-700`}>
        {getAvatarLetter(user.name)}
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-700 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{user.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{user.role}</p>
        <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;