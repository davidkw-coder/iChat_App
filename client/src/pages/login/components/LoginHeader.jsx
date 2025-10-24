import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-educational-lg">
          <Icon name="MessageSquare" size={32} color="white" />
        </div>
      </div>

      {/* Welcome Text */}
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Welcome to SchoolChat
      </h1>
      <p className="text-muted-foreground text-lg mb-2">
        Sign in to your account to continue
      </p>
      
      {/* Subtitle */}
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Connect with your classmates, teachers, and school community in a secure environment
      </p>
    </div>
  );
};

export default LoginHeader;