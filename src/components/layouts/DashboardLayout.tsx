
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
  const scrollFadeStyles = useScrollFade({ 
    threshold: 10, 
    fadeDistance: 80,
    disableTransformOnMobile: true 
  });

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', String(newState));
  };

  return (
    <div className="flex flex-col bg-gray-50">
      <div className="transition-all duration-300 min-h-[64px]">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        {isMobile && (
          <div className="bg-white">
            <BreadcrumbBar />
          </div>
        )}
      </div>
      
      <div className="flex flex-1 relative">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className={`flex-1 w-full transition-all duration-300 flex flex-col overflow-y-auto`}>
          {!isMobile && <BreadcrumbBar />}
          
          <div className="max-w-7xl mx-auto w-full flex-1">
            <motion.div 
              className={`p-4 ${isMobile ? 'pb-28' : 'pb-20'} h-full`}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default DashboardLayout;
