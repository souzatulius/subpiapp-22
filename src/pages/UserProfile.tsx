
import React from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import UserProfileView from '@/components/profile/UserProfileView';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';

const UserProfile: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

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
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-1">
          {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
          
          <main className="flex-1">
            {!isMobile && <BreadcrumbBar />}
            
            <div className="container max-w-7xl mx-auto">
              <div className={`p-4 ${isMobile ? 'pb-16' : 'pb-4'}`}>
                {isMobile && <BreadcrumbBar className="mb-4" />}
                <UserProfileView />
              </div>
            </div>
          </main>
        </div>
        
        {isMobile && <MobileBottomNav />}
      </div>
    </ProtectedRoute>
  );
};

export default UserProfile;
