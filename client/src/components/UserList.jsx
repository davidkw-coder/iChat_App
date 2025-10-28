import React from 'react';

const UserList = ({ 
  users, 
  onlineUsers, 
  onSelectUser 
}) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-purple-400 to-purple-600';
      case 'teacher':
        return 'from-green-400 to-green-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* User List */}
      <div className="divide-y divide-gray-100">
        {users.map((user) => (
          <div
            key={user.encrypted_yw_id}
            onClick={() => onSelectUser(user.encrypted_yw_id)}
            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="relative flex-shrink-0">
              {user.photo_url ? (
                <img
                  src={user.photo_url}
                  alt={user.display_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(user.role)} rounded-full flex items-center justify-center text-white font-semibold`}>
                  {getInitials(user.display_name)}
                </div>
              )}
              
              {/* Online Status Indicator */}
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isUserOnline(user.encrypted_yw_id) 
                  ? 'bg-green-500' 
                  : 'bg-gray-400'
              }`}></div>
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {user.display_name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800'
                    : user.role === 'teacher'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">
                {isUserOnline(user.encrypted_yw_id) ? 'Active now' : 'Offline'}
              </p>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;