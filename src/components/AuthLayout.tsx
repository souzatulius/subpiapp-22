
import React from 'react';
import PWAButton from './PWAButton';
import Header from '@/components/layouts/Header';
import LeftContentSection from './shared/LeftContentSection';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-white md:bg-[#FFFAFA]">
      {/* Header - explicitly pass hideUserMenu={true} for auth pages */}
      <Header showControls={false} hideUserMenu={true} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row pb-16">
        {/* Left side - Fixed content - Mostrar apenas no desktop */}
        {!isMobile && (
          <div className="hidden md:flex md:w-1/2 bg-white px-6 md:px-16 py-12 flex-col justify-center lg:px-[20px] h-full min-h-full">
            <LeftContentSection />
          </div>
        )}

        {/* Right side - Dynamic content */}
        <div className={`w-full min-h-[calc(100vh-80px)] md:min-h-0 md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 md:pl-[50px] relative ${isMobile ? 'bg-subpi-blue' : ''}`}>
          <div className="login-bg-image absolute top-0 left-0 w-full h-full"></div>
          <div className="w-full flex justify-center items-center animate-fade-right z-10 relative">
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
