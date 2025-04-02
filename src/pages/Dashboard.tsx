
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
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { useEffect, useCallback } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { firstName } = useDashboardState();
  const { profile } = useUserData();
  
  const [dashboardCards, setDashboardCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load dashboard configuration based on user's department
  const loadDashboardConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      // Determine the user's department ID, fall back to default if not available
      const departmentId = profile?.coordenacao_id || 'default';
      console.log('Loading dashboard config for department:', departmentId);
      
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', departmentId)
        .eq('view_type', 'dashboard')
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading dashboard config:', error);
        setDashboardCards([]);
      } else if (data && data.cards_config) {
        try {
          // Parse the configuration and set cards
          const config = JSON.parse(data.cards_config);
          console.log('Loaded dashboard cards:', config.length);
          setDashboardCards(config);
        } catch (e) {
          console.error('Error parsing dashboard config:', e);
          setDashboardCards([]);
        }
      } else {
        console.log('No dashboard config found, using empty array');
        setDashboardCards([]);
      }
    } catch (e) {
      console.error('Error in loadDashboardConfig:', e);
      setDashboardCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [profile?.coordenacao_id]);
  
  useEffect(() => {
    if (user) {
      loadDashboardConfig();
    }
  }, [user, loadDashboardConfig]);

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
            
            {/* Display dashboard cards */}
            <div className="mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
                  <span className="text-blue-800">Carregando seu dashboard...</span>
                </div>
              ) : dashboardCards.length > 0 ? (
                <UnifiedCardGrid 
                  cards={dashboardCards.filter(card => !card.isHidden)} 
                  onCardsChange={() => {}}
                  isMobileView={isMobile}
                  specialCardsData={{
                    overdueCount: 0,
                    overdueItems: [],
                    notesToApprove: 0,
                    responsesToDo: 0,
                    isLoading: false
                  }}
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">Nenhum card configurado para exibição.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation - only visible on mobile */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Dashboard;
