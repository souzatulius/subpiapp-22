
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
    <div className="min-h-screen flex flex-col bg-white md:bg-transparent">
      {/* Header - explicitly pass hideUserMenu={true} for auth pages */}
      <Header showControls={false} hideUserMenu={true} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Fixed content - Mostrar apenas no desktop */}
        {!isMobile && (
          <div className="hidden md:flex md:w-1/2 bg-white px-6 md:px-16 py-12 flex-col justify-center lg:px-[20px] h-full min-h-full">
            <LeftContentSection />
          </div>
        )}

        {/* Right side - Dynamic content with background image apenas no desktop */}
        <div 
          className="w-full min-h-[calc(100vh-80px)] md:min-h-0 md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 md:pl-[50px] relative bg-subpi-blue md:bg-subpi-blue" 
          style={!isMobile ? {
            backgroundImage: 'url("/lovable-uploads/1acadb74-1581-4ff3-9b91-3b74acef114f.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            opacity: '0.8'
          } : undefined}
        >
          <div className="w-full flex justify-center items-center animate-fade-right">
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
