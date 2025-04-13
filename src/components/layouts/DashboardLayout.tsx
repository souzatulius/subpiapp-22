import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layouts/header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollFade } from '@/hooks/useScrollFade';
import { motion } from 'framer-motion';
import FeedbackProvider from '@/components/ui/feedback-provider';
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
  return <FeedbackProvider>
      <div className="flex flex-col min-h-screen bg-[#FFFAFA]">
        <Header showControls={true} toggleSidebar={toggleSidebar} className="flex-shrink-0 z-10" />
        
        {/* Flex container for remaining space */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar container with full height */}
          {!isMobile && <div className="sidebar-full-height">
              <DashboardSidebar isOpen={sidebarOpen} />
            </div>}
          
          <main className="flex-1 flex flex-col overflow-hidden px-0 mx-0 my-0">
            {!isMobile && <BreadcrumbBar className="flex-shrink-0" />}
            
            <div className="flex-1 w-full max-w-7xl mx-auto overflow-y-auto my-0">
              <motion.div initial={{
              opacity: 1,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5
            }} className="my-0">
                {isMobile && <BreadcrumbBar className="mb-4 sticky top-0 z-10 bg-white flex-shrink-0" />}
                
                <div className="h-full px-[30px] my-0">
                  <Outlet />
                </div>
              </motion.div>
            </div>
          </main>
        </div>
        
        {isMobile && <MobileBottomNav />}
      </div>
    </FeedbackProvider>;
};
export default DashboardLayout;