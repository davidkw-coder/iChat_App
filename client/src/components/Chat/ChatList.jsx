import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import UserProfile from '../Common/UserProfile';

const ChatList = ({ setSelectedChat }) => {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await API.get('/users');
        // Filter users based on roles (example: Students can chat with Teachers/Admins, Teachers with Students/Admins, Admins with all)
        let filteredUsers = res.data;

        // Simple role-based filter (can be more complex)
        // For simplicity, let everyone chat with everyone else for now.
        // If you need strict role-based chat, implement more complex filtering here.

        setUsers(filteredUsers);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  if (loading) return <div className="p-4 text-center dark:text-gray-300">Loading users...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Contacts</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <p className="p-4 text-gray-600 dark:text-gray-400">No other users found.</p>
        ) : (
          users.map((chatUser) => (
            <div
              key={chatUser._id}
              onClick={() => setSelectedChat(chatUser)}
              className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition duration-150"
            >
              <UserProfile user={chatUser} isOnline={onlineUsers.includes(chatUser._id)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;