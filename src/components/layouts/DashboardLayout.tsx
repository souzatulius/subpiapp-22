
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Only show sidebar on desktop */}
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default DashboardLayout;
