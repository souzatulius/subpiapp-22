
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
        {!isMobile && (
          <div className="h-full flex-shrink-0">
            <DashboardSidebar isOpen={sidebarOpen} />
          </div>
        )}
        
        <main className="flex-1 flex flex-col overflow-auto">
          {/* Desktop breadcrumb */}
          {!isMobile && <BreadcrumbBar className="flex-shrink-0" />}
          
          <div className="flex-1 max-w-full mx-auto w-full overflow-y-auto">
            <div className={`p-4 ${isMobile ? 'pb-32' : ''}`}>
              <div className="transition-all duration-300">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Ranking das Subs</h1>
              </div>
              <RankingContent filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} />
            </div>
          </div>
        </main>
      </div>
      
      {isMobile && <MobileBottomNav className="flex-shrink-0" />}
    </div>
  );
};

export default RankingSubs;
