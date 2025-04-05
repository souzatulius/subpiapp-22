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
  return <div className="min-h-screen flex flex-col bg-white md:bg-transparent">
      {/* Header - explicitly pass hideUserMenu={true} for auth pages */}
      <Header showControls={false} hideUserMenu={true} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Fixed content - Mostrar apenas no desktop */}
        {!isMobile && <div className="hidden md:flex md:w-1/2 bg-white px-6 md:px-16 py-12 flex-col justify-center lg:px-[20px]">
            <LeftContentSection />
          </div>}

        {/* Right side - Dynamic content with background image apenas no desktop */}
        <div className="w-full min-h-[calc(100vh-80px)] md:min-h-0 md:w-1/2 flex flex-col items-start justify-start pt-10 md:pt-12 md:items-start md:justify-start p-8 relative bg-subpi-blue md:bg-subpi-blue" style={!isMobile ? {
        backgroundImage: 'url("/lovable-uploads/93093cf9-6088-4d69-b6fa-f2aef9d9dddc.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat'
      } : undefined}>
          <div className="w-full max-w-md animate-fade-right">
            {children}
          </div>
        </div>
      </div>

      {/* PWA Button */}
      <PWAButton />
    </div>;
};
export default AuthLayout;