import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoForm from './components/PersonalInfoForm';
import PreferencesPanel from './components/PreferencesPanel';
import SecuritySettings from './components/SecuritySettings';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState({
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1702089050621-62646a2b748f",
    avatarAlt: "Professional headshot of woman with shoulder-length brown hair wearing navy blazer",
    phone: "+1 (555) 123-4567",
    bio: "Mathematics teacher with 8 years of experience. Passionate about making complex concepts accessible to all students through innovative teaching methods.",
    location: "New York, NY",
    website: "https://sarahjohnson-math.com",
    joinDate: "September 2019",
    lastActive: "2 minutes ago"
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: {
      messages: true,
      mentions: true,
      groupChats: true,
      systemAlerts: true,
      emailDigest: false,
      pushNotifications: true
    },
    privacy: {
      showOnlineStatus: true,
      allowDirectMessages: true,
      showLastSeen: true,
      profileVisibility: 'everyone'
    },
    communication: {
      autoTranslate: false,
      readReceipts: true,
      typingIndicators: true,
      soundEffects: true
    }
  });

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleAvatarUpdate = (newAvatarUrl) => {
    setUser((prev) => ({
      ...prev,
      avatar: newAvatarUrl
    }));
  };

  const handlePersonalInfoSave = (formData) => {
    setUser((prev) => ({
      ...prev,
      ...formData
    }));
  };

  const handlePreferencesSave = (newPreferences) => {
    setPreferences(newPreferences);

    // Apply theme change immediately
    if (newPreferences?.theme === 'dark') {
      document.documentElement?.classList?.add('dark');
    } else {
      document.documentElement?.classList?.remove('dark');
    }
  };

  const handlePasswordChange = (passwordData) => {
    console.log('Password changed successfully');
  };

  const handleLogoutAllSessions = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const tabs = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: 'User',
    description: 'Manage your personal information'
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: 'Settings',
    description: 'Customize your experience'
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'Shield',
    description: 'Password and session management'
  }];


  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoForm
            user={user}
            onSave={handlePersonalInfoSave} />);


      case 'preferences':
        return (
          <PreferencesPanel
            preferences={preferences}
            onSave={handlePreferencesSave} />);


      case 'security':
        return (
          <SecuritySettings
            onPasswordChange={handlePasswordChange}
            onLogoutAllSessions={handleLogoutAllSessions} />);


      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <div className="pt-16 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account information and preferences
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              iconName="ArrowLeft"
              iconPosition="left">

              Back to Dashboard
            </Button>
          </div>

          {/* Profile Header */}
          <div className="mb-8">
            <ProfileHeader
              user={user}
              onAvatarUpdate={handleAvatarUpdate} />

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-4 shadow-educational sticky top-24">
                <nav className="space-y-2">
                  {tabs?.map((tab) =>
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-educational ${
                    activeTab === tab?.id ?
                    'bg-primary text-primary-foreground' :
                    'hover:bg-muted text-foreground'}`
                    }>

                      <Icon
                      name={tab?.icon}
                      size={18}
                      color={activeTab === tab?.id ? 'white' : 'currentColor'} />

                      <div>
                        <div className="font-medium">{tab?.label}</div>
                        <div className={`text-xs ${
                      activeTab === tab?.id ?
                      'text-primary-foreground/80' :
                      'text-muted-foreground'}`
                      }>
                          {tab?.description}
                        </div>
                      </div>
                    </button>
                  )}
                </nav>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/dashboard')}
                      iconName="MessageCircle"
                      iconPosition="left"
                      className="w-full justify-start">

                      Go to Messages
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="HelpCircle"
                      iconPosition="left"
                      className="w-full justify-start">

                      Help & Support
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      iconName="LogOut"
                      iconPosition="left"
                      className="w-full justify-start text-error hover:text-error hover:bg-error/10">

                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="slide-up">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default UserProfile;