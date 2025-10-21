import React, { useState } from 'react';
import Navbar from '../components/Common/Navbar';
import ChatList from '../components/Chat/ChatList';
import ChatWindow from '../components/Chat/ChatWindow';

const Dashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <ChatList setSelectedChat={setSelectedChat} />
        <ChatWindow selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default Dashboard;