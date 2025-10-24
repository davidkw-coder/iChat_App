import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user, onLogout, className = '' }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleProfileClick = () => {
    navigate('/user-profile');
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  const isActive = (path) => {
    return location?.pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-educational ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-educational"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="MessageSquare" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground">SchoolChat</h1>
              <p className="text-xs text-muted-foreground -mt-1">Educational Communication</p>
            </div>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button
            variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
            onClick={() => navigate('/dashboard')}
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
            className="text-sm"
          >
            Messages
          </Button>
          
          <Button
            variant="ghost"
            iconName="Users"
            iconPosition="left"
            iconSize={16}
            className="text-sm"
          >
            Contacts
          </Button>
          
          <Button
            variant="ghost"
            iconName="Calendar"
            iconPosition="left"
            iconSize={16}
            className="text-sm"
          >
            Schedule
          </Button>
          
          <Button
            variant="ghost"
            iconName="FileText"
            iconPosition="left"
            iconSize={16}
            className="text-sm"
          >
            Resources
          </Button>
        </nav>

        {/* User Profile Section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Icon name="Bell" size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full pulse-gentle"></span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-educational"
            >
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.name || 'User Name'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role || 'Student'}
                </p>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-educational-lg z-50">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-sm text-popover-foreground">
                    {user?.name || 'User Name'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'user@school.edu'}
                  </p>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-educational"
                  >
                    <Icon name="User" size={16} className="mr-3" />
                    Profile Settings
                  </button>
                  
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-educational"
                  >
                    <Icon name="Settings" size={16} className="mr-3" />
                    Preferences
                  </button>
                  
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-educational"
                  >
                    <Icon name="HelpCircle" size={16} className="mr-3" />
                    Help & Support
                  </button>
                  
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-error hover:bg-muted transition-educational"
                    >
                      <Icon name="LogOut" size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-card">
        <div className="flex items-center justify-around py-2">
          <Button
            variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => navigate('/dashboard')}
            iconName="MessageCircle"
            className="flex-col h-auto py-2"
          >
            <span className="text-xs mt-1">Messages</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Users"
            className="flex-col h-auto py-2"
          >
            <span className="text-xs mt-1">Contacts</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Calendar"
            className="flex-col h-auto py-2"
          >
            <span className="text-xs mt-1">Schedule</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="FileText"
            className="flex-col h-auto py-2"
          >
            <span className="text-xs mt-1">Resources</span>
          </Button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-20"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;