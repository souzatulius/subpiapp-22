
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layouts/header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollFade } from '@/hooks/useScrollFade';
import { motion } from 'framer-motion';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const scrollFadeStyles = useScrollFade({ threshold: 10, fadeDistance: 80 });

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    // Save to localStorage
    localStorage.setItem('sidebarOpen', String(newState));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
      
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
        {/* Only show sidebar on desktop */}
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className={`flex-1 overflow-auto w-full ${isMobile ? 'pt-10' : ''} transition-all duration-300`}>
          {/* Desktop breadcrumb */}
          {!isMobile && <BreadcrumbBar />}
          
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className={`p-4 ${isMobile ? 'pb-32' : 'pb-20'}`}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation - only show on mobile */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default DashboardLayout;
