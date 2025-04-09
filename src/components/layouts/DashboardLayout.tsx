
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
    <div className="flex flex-col h-screen bg-[#FFFAFA]">
      <Header 
        showControls={true} 
        toggleSidebar={toggleSidebar} 
        className="flex-shrink-0 z-10"
      />
      
      {/* Flex container que distribui a altura restante */}
      <div className="flex flex-1 overflow-hidden">
        {/* Container do sidebar com altura explícita */}
        {!isMobile && (
          <div className="h-full flex-shrink-0">
            <DashboardSidebar isOpen={sidebarOpen} />
          </div>
        )}
        
        <main className="flex-1 flex flex-col overflow-auto">
          {!isMobile && <BreadcrumbBar className="flex-shrink-0" />}
          
          <div className="flex-1 w-full max-w-7xl mx-auto overflow-y-auto">
            <motion.div 
              className={`p-2 sm:p-4 ${isMobile ? 'pb-16 pt-0' : 'pb-6'}`}
              initial={{ opacity: 1, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              {isMobile && <BreadcrumbBar className="mb-4 sticky top-0 z-10 bg-white flex-shrink-0" />}
              
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
