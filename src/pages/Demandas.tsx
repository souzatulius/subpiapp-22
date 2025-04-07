
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Layout } from '@/components/demandas';
import DemandasContent from '@/components/demandas/DemandasContent';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { useScrollFade } from '@/hooks/useScrollFade';

const Demandas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const scrollFadeStyles = useScrollFade({ threshold: 10, fadeDistance: 80 });
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* Fixed breadcrumb for mobile */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white">
          <BreadcrumbBar />
        </div>
      )}
      
      {/* Header with fade effect on mobile */}
      <div 
        style={isMobile ? scrollFadeStyles : undefined}
        className={`${isMobile ? 'transition-all duration-300' : ''}`}
      >
        <Header showControls={true} toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 overflow-hidden px-0">
        {/* Sidebar - desktop only */}
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}

        {/* Main content */}
        <div className={`flex-1 overflow-auto ${isMobile ? 'pt-10' : ''}`}>
          {/* Desktop breadcrumb */}
          {!isMobile && <BreadcrumbBar />}
          
          <div className="max-w-7xl mx-auto">
            <Layout>
              <div className={`${isMobile ? 'pb-32' : 'pb-20'}`}>
                <DemandasContent />
              </div>
            </Layout>
          </div>
        </div>
      </div>
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Demandas;
