import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-2xl font-bold">
          School Chat
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-white text-lg hidden md:block">
                Welcome, {user.name} ({user.role})
              </span>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-white hover:bg-blue-700 dark:hover:bg-gray-700 transition duration-200"
              >
                {darkMode ? (
                  <SunIcon className="h-6 w-6 text-yellow-300" />
                ) : (
                  <MoonIcon className="h-6 w-6 text-blue-200" />
                )}
              </button>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;