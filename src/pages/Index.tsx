
import React from 'react';
import PWAButton from '@/components/PWAButton';
import Header from '@/components/layouts/Header';
import LeftContentSection from '@/components/shared/LeftContentSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - explicitly pass showControls={false} */}
      <Header showControls={false} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Content */}
        <div className="w-full md:w-1/2 px-6 md:px-16 lg:px-20 py-12 flex flex-col justify-center">
          <LeftContentSection />
        </div>
        
        {/* Right side with blue background */}
        <div className="w-full md:w-1/2 bg-[#003570] flex flex-col items-center justify-center p-8 relative">
          <img alt="Logo SUB PI" src="/lovable-uploads/eb0076f1-2566-457e-99aa-aebc32408720.png" className="w-2/3 max-w-sm object-fill" />
        </div>
      </div>
      
      {/* PWA Button */}
      <PWAButton />
    </div>
  );
};

export default Index;
