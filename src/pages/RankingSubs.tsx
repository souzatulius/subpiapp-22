
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import RankingContent from '@/components/ranking/RankingContent';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { useScrollFade } from '@/hooks/useScrollFade';
// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';

const RankingSubs = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const scrollFadeStyles = useScrollFade({ threshold: 10, fadeDistance: 80 });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main 
          className="flex-1 w-full"
          style={{
            backgroundImage: 'url("/lovable-uploads/c20c039e-c465-4258-90c1-fdcf2625b808.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: '0.8'
          }}
        >
          {/* Desktop breadcrumb */}
          {!isMobile && <BreadcrumbBar />}
          
          <div className="max-w-full mx-auto">
            <div className={`p-4 ${isMobile ? 'pb-32' : ''}`}>
              <div className="transition-all duration-300">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Ranking das Subs</h1>
              </div>
              <RankingContent filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} />
            </div>
          </div>
        </main>
      </div>
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default RankingSubs;
