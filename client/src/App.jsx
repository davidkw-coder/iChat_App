import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useChatStore } from './store/chatStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import './index.css';

function App() {
  const { user, checkAuth } = useAuthStore();
  const { initializeSocket } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      initializeSocket();
    }
  }, [user, initializeSocket]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/chat" />} />
          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;