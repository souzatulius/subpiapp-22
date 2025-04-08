
import React from 'react';
import PWAButton from '@/components/PWAButton';
import Header from '@/components/layouts/Header';
import LeftContentSection from '@/components/shared/LeftContentSection';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header - explicitly hide user controls */}
      <Header showControls={false} hideUserMenu={true} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Content */}
        <div className="w-full md:w-1/2 sticky top-0 h-screen px-6 md:px-16 lg:px-20 py-12 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto md:mx-0">
            <LeftContentSection />
          </div>
        </div>
        
        {/* Right side with blue background and background image (only on desktop) */}
        <div 
          className="hidden md:flex md:w-1/2 bg-subpi-blue flex-col items-center justify-center p-8 pl-[50px] relative animate-fade-right"
          style={!isMobile ? {
            backgroundImage: 'url("/lovable-uploads/93093cf9-6088-4d69-b6fa-f2aef9d9dddc.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat'
          } : undefined}
        >
          {/* No image here anymore */}
        </div>
      </div>
      
      {/* PWA Button */}
      <PWAButton />
    </div>
  );
};

export default Index;
