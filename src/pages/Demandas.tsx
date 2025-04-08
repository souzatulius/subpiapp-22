
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
    <div className="min-h-screen flex flex-col bg-[#FFFAFA]">
      {/* Header */}
      <div className="transition-all duration-300">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        {/* Mobile breadcrumb directly below header */}
        {isMobile && (
          <div className="bg-white">
            <BreadcrumbBar />
          </div>
        )}
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar - desktop only */}
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}

        {/* Main content */}
        <div className="flex-1 w-full bg-[#FFFAFA]">
          {/* Desktop breadcrumb */}
          {!isMobile && <BreadcrumbBar />}
          
          <div className="max-w-7xl mx-auto">
            <Layout>
              <div className={`${isMobile ? 'pb-32' : ''}`}>
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
