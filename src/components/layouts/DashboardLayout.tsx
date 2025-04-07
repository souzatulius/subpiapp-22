
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layouts/header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollFade } from '@/hooks/useScrollFade';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const scrollFadeStyles = useScrollFade({ threshold: 10, fadeDistance: 80 });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 print:bg-white">
      {/* Fixed breadcrumb for mobile - hidden when printing */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white print:hidden">
          <BreadcrumbBar />
        </div>
      )}
      
      {/* Header with fade effect on mobile - hidden when printing */}
      <div 
        style={isMobile ? scrollFadeStyles : undefined}
        className={`${isMobile ? 'transition-all duration-300' : ''} print:hidden`}
      >
        <Header showControls={true} hideUserMenu={false} />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Only show sidebar on desktop - hidden when printing */}
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} className="print:hidden" />}
        
        <main className={`flex-1 overflow-auto w-full ${isMobile ? 'pt-10' : ''} print:pt-0 print:m-0 print:p-0`}>
          {/* Desktop breadcrumb - hidden when printing */}
          {!isMobile && <BreadcrumbBar className="print:hidden" />}
          
          <div className="max-w-full mx-auto print:mx-0 print:w-full">
            <div className={`p-4 pb-20 md:pb-4 ${isMobile ? 'pb-32' : ''} print:p-0 print:m-0`}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation - hidden when printing */}
      <MobileBottomNav className="print:hidden" />
    </div>
  );
};

export default DashboardLayout;
