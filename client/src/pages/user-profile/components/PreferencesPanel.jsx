import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PreferencesPanel = ({ preferences, onSave }) => {
  const [settings, setSettings] = useState({
    theme: preferences?.theme || 'light',
    notifications: {
      messages: preferences?.notifications?.messages ?? true,
      mentions: preferences?.notifications?.mentions ?? true,
      groupChats: preferences?.notifications?.groupChats ?? true,
      systemAlerts: preferences?.notifications?.systemAlerts ?? true,
      emailDigest: preferences?.notifications?.emailDigest ?? false,
      pushNotifications: preferences?.notifications?.pushNotifications ?? true
    },
    privacy: {
      showOnlineStatus: preferences?.privacy?.showOnlineStatus ?? true,
      allowDirectMessages: preferences?.privacy?.allowDirectMessages ?? true,
      showLastSeen: preferences?.privacy?.showLastSeen ?? true,
      profileVisibility: preferences?.privacy?.profileVisibility ?? 'everyone'
    },
    communication: {
      autoTranslate: preferences?.communication?.autoTranslate ?? false,
      readReceipts: preferences?.communication?.readReceipts ?? true,
      typingIndicators: preferences?.communication?.typingIndicators ?? true,
      soundEffects: preferences?.communication?.soundEffects ?? true
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleThemeChange = (theme) => {
    setSettings(prev => ({
      ...prev,
      theme
    }));
  };

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev?.privacy,
        [key]: value
      }
    }));
  };

  const handleCommunicationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      communication: {
        ...prev?.communication,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(settings);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-educational">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
          <p className="text-sm text-muted-foreground">Customize your experience and privacy settings</p>
        </div>
      </div>
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <span className="text-success font-medium">Preferences saved successfully!</span>
        </div>
      )}
      <div className="space-y-8">
        {/* Theme Settings */}
        <div>
          <h3 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
            <Icon name="Palette" size={18} />
            Appearance
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-lg border-2 transition-educational ${
                settings?.theme === 'light' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon name="Sun" size={20} className="text-primary" />
                <div className="text-left">
                  <div className="font-medium text-foreground">Light Mode</div>
                  <div className="text-sm text-muted-foreground">Bright and clean interface</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-lg border-2 transition-educational ${
                settings?.theme === 'dark' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon name="Moon" size={20} className="text-primary" />
                <div className="text-left">
                  <div className="font-medium text-foreground">Dark Mode</div>
                  <div className="text-sm text-muted-foreground">Easy on the eyes</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h3 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
            <Icon name="Bell" size={18} />
            Notifications
          </h3>
          <div className="space-y-4">
            <Checkbox
              label="New Messages"
              description="Get notified when you receive new messages"
              checked={settings?.notifications?.messages}
              onChange={(e) => handleNotificationChange('messages', e?.target?.checked)}
            />
            
            <Checkbox
              label="Mentions & Replies"
              description="Get notified when someone mentions or replies to you"
              checked={settings?.notifications?.mentions}
              onChange={(e) => handleNotificationChange('mentions', e?.target?.checked)}
            />
            
            <Checkbox
              label="Group Chat Activity"
              description="Get notified about activity in your group chats"
              checked={settings?.notifications?.groupChats}
              onChange={(e) => handleNotificationChange('groupChats', e?.target?.checked)}
            />
            
            <Checkbox
              label="System Alerts"
              description="Important system notifications and updates"
              checked={settings?.notifications?.systemAlerts}
              onChange={(e) => handleNotificationChange('systemAlerts', e?.target?.checked)}
            />
            
            <Checkbox
              label="Email Digest"
              description="Receive daily email summary of your activity"
              checked={settings?.notifications?.emailDigest}
              onChange={(e) => handleNotificationChange('emailDigest', e?.target?.checked)}
            />
            
            <Checkbox
              label="Push Notifications"
              description="Allow browser push notifications"
              checked={settings?.notifications?.pushNotifications}
              onChange={(e) => handleNotificationChange('pushNotifications', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h3 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
            <Icon name="Shield" size={18} />
            Privacy
          </h3>
          <div className="space-y-4">
            <Checkbox
              label="Show Online Status"
              description="Let others see when you're online"
              checked={settings?.privacy?.showOnlineStatus}
              onChange={(e) => handlePrivacyChange('showOnlineStatus', e?.target?.checked)}
            />
            
            <Checkbox
              label="Allow Direct Messages"
              description="Allow other users to send you direct messages"
              checked={settings?.privacy?.allowDirectMessages}
              onChange={(e) => handlePrivacyChange('allowDirectMessages', e?.target?.checked)}
            />
            
            <Checkbox
              label="Show Last Seen"
              description="Display when you were last active"
              checked={settings?.privacy?.showLastSeen}
              onChange={(e) => handlePrivacyChange('showLastSeen', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Communication Settings */}
        <div>
          <h3 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
            <Icon name="MessageCircle" size={18} />
            Communication
          </h3>
          <div className="space-y-4">
            <Checkbox
              label="Read Receipts"
              description="Send read receipts when you view messages"
              checked={settings?.communication?.readReceipts}
              onChange={(e) => handleCommunicationChange('readReceipts', e?.target?.checked)}
            />
            
            <Checkbox
              label="Typing Indicators"
              description="Show when you're typing a message"
              checked={settings?.communication?.typingIndicators}
              onChange={(e) => handleCommunicationChange('typingIndicators', e?.target?.checked)}
            />
            
            <Checkbox
              label="Sound Effects"
              description="Play sounds for notifications and actions"
              checked={settings?.communication?.soundEffects}
              onChange={(e) => handleCommunicationChange('soundEffects', e?.target?.checked)}
            />
            
            <Checkbox
              label="Auto-translate Messages"
              description="Automatically translate messages to your preferred language"
              checked={settings?.communication?.autoTranslate}
              onChange={(e) => handleCommunicationChange('autoTranslate', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-border">
          <Button
            onClick={handleSave}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPanel;