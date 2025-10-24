import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import CredentialsInfo from './components/CredentialsInfo';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Background Card */}
        <div className="bg-card rounded-2xl shadow-educational-xl border border-border p-8">
          {/* Header Section */}
          <LoginHeader />
          
          {/* Login Form */}
          <LoginForm />
          
          {/* Demo Credentials Info */}
          <CredentialsInfo />
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} SchoolChat. Secure educational communication platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;