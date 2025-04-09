
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
    <div className="flex flex-col h-screen bg-[#FFFAFA]">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        {/* Mobile breadcrumb directly below header */}
        {isMobile && (
          <div className="bg-white">
            <BreadcrumbBar />
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - desktop only */}
        {!isMobile && (
          <div className="h-full flex-shrink-0">
            <DashboardSidebar isOpen={sidebarOpen} />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Desktop breadcrumb */}
          {!isMobile && <BreadcrumbBar className="flex-shrink-0" />}
          
          <div className="flex-1 max-w-7xl mx-auto w-full overflow-y-auto">
            <Layout>
              <div className={`${isMobile ? 'pb-32' : ''}`}>
                <DemandasContent />
              </div>
            </Layout>
          </div>
        </div>
      </div>
      
      {isMobile && <MobileBottomNav className="flex-shrink-0" />}
    </div>
  );
};

export default Demandas;
