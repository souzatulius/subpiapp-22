
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layouts/header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollFade } from '@/hooks/useScrollFade';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
        <Header showControls={true} toggleSidebar={isMobile ? toggleSidebar : undefined} />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Only show sidebar on desktop */}
        {!isMobile && (
          <>
            <DashboardSidebar isOpen={sidebarOpen} />
            
            {/* Collapse button (desktop only) - now hidden */}
            {/* The collapse button was here but has been removed as requested */}
          </>
        )}
        
        <main className={`flex-1 overflow-auto w-full ${isMobile ? 'pt-10' : ''} transition-all duration-300`}>
          {/* Desktop breadcrumb */}
          {!isMobile && <BreadcrumbBar />}
          
          <div className="max-w-full mx-auto">
            <div className={`p-4 pb-20 md:pb-4 ${isMobile ? 'pb-32' : ''}`}>
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
