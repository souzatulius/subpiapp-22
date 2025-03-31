
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/hooks/useSupabaseAuth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { getDefaultCards } from '@/hooks/dashboard/defaultCards';
import { Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';

const Dashboard = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [firstName, setFirstName] = useState('');

  // Fetch user's first name
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.id) return;
      
      try {
        const { data } = await fetch(`/api/users/${user.id}/basic-info`).then(res => res.json());
        
        if (data?.nome_completo) {
          setFirstName(data.nome_completo.split(' ')[0]);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };
    
    fetchUserInfo();
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Default cards as fallback
  const defaultCards = getDefaultCards();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <DashboardHeader firstName={firstName} />
            
            {user && (
              <UnifiedDashboard
                userId={user.id}
                dashboardType="dashboard" 
                title={`Olá, ${firstName || 'Usuário'}!`}
                description="Organize esta área do seu jeito, movendo ou ocultando os cards."
                fallbackCards={defaultCards}
              />
            )}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation - only visible on mobile */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Dashboard;
