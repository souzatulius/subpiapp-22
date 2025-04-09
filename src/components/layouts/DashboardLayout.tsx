
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
    <div className="flex flex-col bg-[#FFFAFA] min-h-screen">
      <div className="transition-all duration-300 min-h-[64px]">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        {/* Desktop breadcrumb - now attached directly to header */}
        {!isMobile && <BreadcrumbBar className="mt-0 border-t-0" />}
      </div>
      
      <div className="flex flex-1 relative">
        {/* Sidebar with height set to full available space */}
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 w-full transition-all duration-300 bg-[#FFFAFA]">
          <div className="max-w-7xl mx-auto w-full flex-1">
            <motion.div 
              className={`p-2 sm:p-4 ${isMobile ? 'pb-16 pt-0' : 'pb-6'} h-full`}
              initial={{ opacity: 1, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              {/* Only on mobile, render BreadcrumbBar right BEFORE the main content, now sticky */}
              {isMobile && <BreadcrumbBar className="mb-0 sticky top-0 z-10 bg-white" />}
              
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
