import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationForm from './components/RegistrationForm';
import RegistrationSidebar from './components/RegistrationSidebar';

const Register = () => {
  const location = useLocation();

  useEffect(() => {
    // Set page title
    document.title = 'Register - SchoolChat';
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Registration Content */}
      <div className="flex-1 lg:w-1/2 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Registration Header */}
            <RegistrationHeader />
            
            {/* Registration Form */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-educational-lg">
              <RegistrationForm />
            </div>
            
            {/* Footer Links */}
            <div className="text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <button
                  type="button"
                  className="hover:text-foreground transition-educational"
                  onClick={() => window.open('/help', '_blank')}
                >
                  Help Center
                </button>
                <button
                  type="button"
                  className="hover:text-foreground transition-educational"
                  onClick={() => window.open('/contact', '_blank')}
                >
                  Contact Support
                </button>
                <button
                  type="button"
                  className="hover:text-foreground transition-educational"
                  onClick={() => window.open('/accessibility', '_blank')}
                >
                  Accessibility
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} SchoolChat. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar with Benefits and Testimonials */}
      <RegistrationSidebar />
    </div>
  );
};

export default Register;