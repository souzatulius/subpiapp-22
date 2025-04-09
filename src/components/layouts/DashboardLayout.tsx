
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
    // Use min-h-screen para garantir altura mínima de 100% da viewport
    <div className="flex flex-col bg-[#FFFAFA] min-h-screen">
      <div className="transition-all duration-300 min-h-[64px] z-10 flex-shrink-0">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        {!isMobile && <BreadcrumbBar className="mt-0 border-t-0" />}
      </div>
      
      {/* Use flex-1 para ocupar todo o espaço disponível e flex para distribuir altura aos filhos */}
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        {/* O container do sidebar precisa ter height: 100% */}
        {!isMobile && (
          <div className="h-full">
            <DashboardSidebar isOpen={sidebarOpen} />
          </div>
        )}
        
        <main className="flex-1 w-full transition-all duration-300 bg-[#FFFAFA] overflow-auto">
          <div className="max-w-7xl mx-auto w-full flex-1">
            <motion.div 
              className={`p-2 sm:p-4 ${isMobile ? 'pb-16 pt-0' : 'pb-6'} h-full`}
              initial={{ opacity: 1, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
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
