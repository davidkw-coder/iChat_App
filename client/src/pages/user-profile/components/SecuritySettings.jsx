import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SecuritySettings = ({ onPasswordChange, onLogoutAllSessions }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Mock active sessions data
  const activeSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, NY",
      lastActive: "Active now",
      isCurrent: true,
      ip: "192.168.1.100"
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, NY", 
      lastActive: "2 hours ago",
      isCurrent: false,
      ip: "192.168.1.101"
    },
    {
      id: 3,
      device: "Chrome on Android",
      location: "Brooklyn, NY",
      lastActive: "1 day ago", 
      isCurrent: false,
      ip: "192.168.1.102"
    }
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e?.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordForm?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(passwordForm?.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordForm?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Mock validation for current password
    if (passwordForm?.currentPassword && passwordForm?.currentPassword !== 'currentpass123') {
      newErrors.currentPassword = 'Current password is incorrect';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onPasswordChange(passwordForm);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to change password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutSession = (sessionId) => {
    // Mock logout session functionality
    console.log('Logging out session:', sessionId);
  };

  const handleLogoutAllSessions = () => {
    if (window.confirm('Are you sure you want to log out of all devices? You will need to sign in again on all devices.')) {
      onLogoutAllSessions();
    }
  };

  const getDeviceIcon = (device) => {
    if (device?.includes('iPhone') || device?.includes('Android')) {
      return 'Smartphone';
    } else if (device?.includes('iPad') || device?.includes('Tablet')) {
      return 'Tablet';
    }
    return 'Monitor';
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-educational">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
            <Icon name="Lock" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
            <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <span className="text-success font-medium">Password changed successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {errors?.submit && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3">
            <Icon name="AlertCircle" size={20} className="text-error" />
            <span className="text-error font-medium">{errors?.submit}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPasswords?.current ? "text" : "password"}
              name="currentPassword"
              value={passwordForm?.currentPassword}
              onChange={handlePasswordChange}
              error={errors?.currentPassword}
              required
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-educational"
            >
              <Icon name={showPasswords?.current ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showPasswords?.new ? "text" : "password"}
              name="newPassword"
              value={passwordForm?.newPassword}
              onChange={handlePasswordChange}
              error={errors?.newPassword}
              required
              placeholder="Enter your new password"
              description="Must be at least 8 characters with uppercase, lowercase, and number"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-educational"
            >
              <Icon name={showPasswords?.new ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showPasswords?.confirm ? "text" : "password"}
              name="confirmPassword"
              value={passwordForm?.confirmPassword}
              onChange={handlePasswordChange}
              error={errors?.confirmPassword}
              required
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-educational"
            >
              <Icon name={showPasswords?.confirm ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>

          <Button
            type="submit"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Change Password
          </Button>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Password Requirements:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">
              <Icon name="Check" size={14} className="text-success" />
              At least 8 characters long
            </li>
            <li className="flex items-center gap-2">
              <Icon name="Check" size={14} className="text-success" />
              Contains uppercase and lowercase letters
            </li>
            <li className="flex items-center gap-2">
              <Icon name="Check" size={14} className="text-success" />
              Contains at least one number
            </li>
            <li className="flex items-center gap-2">
              <Icon name="Check" size={14} className="text-success" />
              Different from your current password
            </li>
          </ul>
        </div>
      </div>
      {/* Active Sessions Section */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-educational">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="Smartphone" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Active Sessions</h2>
              <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={handleLogoutAllSessions}
            iconName="LogOut"
            iconPosition="left"
            size="sm"
          >
            Logout All
          </Button>
        </div>

        <div className="space-y-4">
          {activeSessions?.map((session) => (
            <div
              key={session?.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-educational"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name={getDeviceIcon(session?.device)} size={20} className="text-muted-foreground" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{session?.device}</span>
                    {session?.isCurrent && (
                      <span className="px-2 py-1 bg-success text-success-foreground text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session?.location} • {session?.lastActive}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    IP: {session?.ip}
                  </div>
                </div>
              </div>

              {!session?.isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLogoutSession(session?.id)}
                  iconName="X"
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  End Session
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Security Tips */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Shield" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Security Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Always log out from public or shared devices</li>
                <li>• Use strong, unique passwords for your account</li>
                <li>• Regularly review your active sessions</li>
                <li>• Report any suspicious activity immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;