
import React from 'react';
import PWAButton from './PWAButton';
import Header from '@/components/layouts/Header';

interface AuthLayoutProps {
  children: React.ReactNode;
  leftContent: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  leftContent
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - explicitly pass showControls={false} for auth pages */}
      <Header showControls={false} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Fixed content */}
        <div className="w-full md:w-1/2 bg-white px-6 md:px-16 lg:px-20 py-12 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto md:mx-0 animate-fade-in">
            {leftContent}
          </div>
        </div>

        {/* Right side - Dynamic content */}
        <div className="w-full md:w-1/2 bg-[#003570] p-8 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-md animate-fade-in">
            {children}
          </div>
          <img src="/lovable-uploads/5b8c78fb-e26a-45d0-844e-df1dea58037b.png" alt="Logo SUB PI" className="w-2/3 max-w-sm" />
        </div>
      </div>

      {/* PWA Button */}
      <PWAButton />
    </div>
  );
};

export default AuthLayout;
