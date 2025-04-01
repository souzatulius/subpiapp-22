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
  return <div className="min-h-screen flex flex-col">
      {/* Header - explicitly pass showControls={false} for auth pages */}
      <Header showControls={false} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row bg-blue-950">
        {/* Left side - Fixed content - Mostrar apenas no desktop */}
        {!isMobile && <div className="w-full md:w-1/2 bg-white px-6 md:px-16 lg:px-20 py-12 flex flex-col justify-center">
            <LeftContentSection />
          </div>}

        {/* Right side - Dynamic content with background image apenas no desktop */}
        <div style={!isMobile ? {
        backgroundImage: 'url("/lovable-uploads/93093cf9-6088-4d69-b6fa-f2aef9d9dddc.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat'
      } : undefined} className="w-full md:w-1/2 md:bg-subpi-blue flex flex-col items-center justify-center p-8 relative bg-blue-950">
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