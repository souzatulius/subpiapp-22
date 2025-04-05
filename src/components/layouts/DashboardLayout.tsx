
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layouts/header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollBehavior } from '@/hooks/useScrollBehavior';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { isHeaderVisible } = useScrollBehavior();
  const location = useLocation();
  
  // Check if we're on a page that should have the special scroll behavior
  const isSpecialScrollPage = 
    location.pathname === '/dashboard' || 
    location.pathname === '/dashboard/comunicacao';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div 
        className={`sticky z-50 transition-transform duration-300 ease-in-out ${
          isHeaderVisible || !isSpecialScrollPage ? 'top-0' : '-translate-y-full'
        }`}
      >
        <Header showControls={true} toggleSidebar={toggleSidebar} />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Only show sidebar on desktop */}
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto w-full">
          <BreadcrumbBar />
          <div className="max-w-7xl mx-auto">
            <div className={`p-6 pb-20 md:pb-6 ${isSpecialScrollPage ? 'welcome-card-container' : ''}`}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default DashboardLayout;
