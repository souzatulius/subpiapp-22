import React from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const {
    firstName,
    actionCards,
    setActionCards,
    isLoading
  } = useDashboardState(user?.id);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}

        <main className="flex-1 overflow-auto p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <DashboardHeader firstName={firstName} />

            {user && !isLoading && (
              <UnifiedDashboard
                userId={user.id}
                dashboardType="dashboard"
                title={`Olá, ${firstName || 'Usuário'}!`}
                description="Organize esta área do seu jeito, movendo ou ocultando os cards."
                fallbackCards={actionCards}
                setCards={setActionCards}
              />
            )}
          </div>
        </main>
      </div>

      {/* Barra inferior no mobile */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Dashboard;
