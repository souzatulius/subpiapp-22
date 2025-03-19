
import React from 'react';
import PWAButton from './PWAButton';

interface AuthLayoutProps {
  children: React.ReactNode;
  leftContent: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, leftContent }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-3 border-b border-gray-200 flex justify-center">
        <img 
          src="/lovable-uploads/68db2d5a-d2b5-4bd5-98dd-09f54064eb10.png" 
          alt="Logo Prefeitura de São Paulo" 
          className="h-10"
        />
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Fixed content */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-12 flex flex-col justify-center">
          {leftContent}
        </div>

        {/* Right side - Dynamic content */}
        <div className="w-full md:w-1/2 bg-subpi-blue p-6 flex items-center justify-center">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>

      {/* PWA Button */}
      <PWAButton />
    </div>
  );
};

export default AuthLayout;
