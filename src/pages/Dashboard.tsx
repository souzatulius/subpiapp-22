
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDashboardState } from '@/hooks/useDashboardState';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';

const Dashboard = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const { firstName } = useDashboardState();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto">
          <BreadcrumbBar />
          <div className="max-w-7xl mx-auto p-6 pb-20 md:pb-6">
            <WelcomeCard
              title={`Olá, ${firstName}!`}
              description="Bem-vindo ao seu dashboard personalizado."
              icon={<Home className="h-6 w-6 mr-2" />}
              color="bg-gradient-to-r from-blue-800 to-blue-950"
            />
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation - only visible on mobile */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Dashboard;
