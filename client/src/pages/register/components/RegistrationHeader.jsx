import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-educational-lg">
          <Icon name="MessageSquare" size={32} color="white" />
        </div>
      </div>

      {/* Title and Description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Join SchoolChat
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Create your account to start communicating with your school community
        </p>
      </div>

      {/* Features List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={16} color="white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Secure</p>
            <p className="text-xs text-muted-foreground">End-to-end encryption</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={16} color="white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Real-time</p>
            <p className="text-xs text-muted-foreground">Instant messaging</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
            <Icon name="Users" size={16} color="white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Connected</p>
            <p className="text-xs text-muted-foreground">School community</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationHeader;