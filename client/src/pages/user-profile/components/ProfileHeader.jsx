import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, onAvatarUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes?.includes(file?.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file?.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setIsUploading(true);
      
      // Simulate upload process
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          onAvatarUpdate(e?.target?.result);
          setIsUploading(false);
        };
        reader?.readAsDataURL(file);
      }, 1500);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'teacher':
        return 'bg-accent text-accent-foreground';
      case 'administrator':
        return 'bg-error text-error-foreground';
      case 'student':
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-educational">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-muted border-4 border-background shadow-educational-md">
            <Image
              src={user?.avatar}
              alt={user?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Upload Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-educational cursor-pointer">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Icon 
                name={isUploading ? "Loader2" : "Camera"} 
                size={24} 
                color="white" 
                className={isUploading ? "animate-spin" : ""}
              />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={isUploading}
            />
          </div>
          
          {/* Upload Status */}
          {isUploading && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                Uploading...
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <h1 className="text-2xl font-semibold text-foreground">{user?.name}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role)}`}>
              <Icon name="User" size={14} className="mr-1" />
              {user?.role}
            </span>
          </div>
          
          <div className="space-y-2 text-muted-foreground">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Icon name="Mail" size={16} />
              <span className="text-sm">{user?.email}</span>
            </div>
            
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Icon name="Calendar" size={16} />
              <span className="text-sm">Member since {user?.joinDate}</span>
            </div>
            
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Icon name="Clock" size={16} />
              <span className="text-sm">Last active {user?.lastActive}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
            <Button variant="outline" size="sm" iconName="Edit" iconPosition="left">
              Edit Profile
            </Button>
            <Button variant="ghost" size="sm" iconName="Share" iconPosition="left">
              Share Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;