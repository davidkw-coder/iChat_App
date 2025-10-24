import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CredentialsInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mockCredentials = [
    {
      role: 'Student',
      email: 'student@school.edu',
      password: 'student123',
      icon: 'GraduationCap',
      color: 'text-blue-600'
    },
    {
      role: 'Teacher',
      email: 'teacher@school.edu',
      password: 'teacher123',
      icon: 'BookOpen',
      color: 'text-green-600'
    },
    {
      role: 'Administrator',
      email: 'admin@school.edu',
      password: 'admin123',
      icon: 'Shield',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon name="Info" size={16} className="text-muted-foreground mr-2" />
          <span className="text-sm font-medium text-muted-foreground">
            Demo Credentials
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
          className="text-xs"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </Button>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {mockCredentials?.map((cred, index) => (
            <div key={index} className="p-3 bg-card rounded-md border border-border">
              <div className="flex items-center mb-2">
                <Icon name={cred?.icon} size={16} className={`${cred?.color} mr-2`} />
                <span className="text-sm font-medium text-foreground">{cred?.role}</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <span className="w-16">Email:</span>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">
                    {cred?.email}
                  </code>
                </div>
                <div className="flex items-center">
                  <span className="w-16">Password:</span>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">
                    {cred?.password}
                  </code>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Use any of the above credentials to test different user roles
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsInfo;