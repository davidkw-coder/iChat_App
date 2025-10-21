import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext'; // Import SocketProvider
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound'; // Assuming you'll create a simple NotFound page

// A PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You can replace this with a more sophisticated loading spinner or component
    return <div className="text-center p-8 text-lg text-gray-700 dark:text-gray-300">Loading authentication...</div>;
  }

  // If not authenticated, redirect to the login page
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    // BrowserRouter is the router that keeps your UI in sync with the URL
    <Router>
      {/* AuthProvider wraps the entire app to provide authentication context to all components */}
      <AuthProvider>
        {/* SocketProvider wraps the app to provide Socket.IO connection and online users context */}
        <SocketProvider>
          {/* Routes defines the different paths in your application */}
          <Routes>
            {/* Public Routes - Accessible without authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Require authentication */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Default Route - Redirects to dashboard if logged in, or login if not */}
            <Route path="/" element={
              <PrivateRoute>
                 {/* Navigate to dashboard if authenticated, PrivateRoute handles redirect to login if not */}
                <Navigate to="/dashboard" />
              </PrivateRoute>
            } />

            {/* Catch-all Route for 404 Not Found pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;