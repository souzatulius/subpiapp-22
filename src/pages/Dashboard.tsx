import React, { useState, useCallback, useEffect } from 'react';
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
import { ActionCardItem } from '@/types/dashboard';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { firstName } = useDashboardState();
  
  const [dashboardCards, setDashboardCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [configSource, setConfigSource] = useState<'default' | 'custom'>('default');
  
  const getUserDepartment = useCallback(async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('coordenacao_id')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user department:', error);
        return null;
      }
      
      return data?.coordenacao_id || null;
    } catch (e) {
      console.error('Error in getUserDepartment:', e);
      return null;
    }
  }, [user]);
  
  const loadDashboardConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const departmentId = userDepartment || 'default';
      const viewType = 'dashboard';
      
      console.log('Loading dashboard config for department:', departmentId, 'viewType:', viewType);
      
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', departmentId)
        .eq('view_type', viewType)
        .maybeSingle();
        
      if (!error && data && data.cards_config) {
        try {
          const config = JSON.parse(data.cards_config);
          console.log('Loaded department-specific dashboard cards:', config.length);
          setDashboardCards(config);
          setConfigSource('custom');
        } catch (e) {
          console.error('Error parsing dashboard config:', e);
          fetchDefaultConfig();
        }
      } else {
        fetchDefaultConfig();
      }
    } catch (e) {
      console.error('Error in loadDashboardConfig:', e);
      setDashboardCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [userDepartment]);
  
  const fetchDefaultConfig = async () => {
    try {
      console.log('Fetching default dashboard config');
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', 'default')
        .eq('view_type', 'dashboard')
        .maybeSingle();
        
      if (!error && data && data.cards_config) {
        try {
          const config = JSON.parse(data.cards_config);
          console.log('Loaded default dashboard cards:', config.length);
          setDashboardCards(config);
          setConfigSource('default');
        } catch (e) {
          console.error('Error parsing default dashboard config:', e);
          setDashboardCards([]);
        }
      } else {
        console.log('No default dashboard config found, using empty array');
        setDashboardCards([]);
      }
    } catch (e) {
      console.error('Error in fetchDefaultConfig:', e);
      setDashboardCards([]);
    }
  };
  
  useEffect(() => {
    const handleDashboardConfigUpdate = (event: CustomEvent<{department: string, viewType: string}>) => {
      const { department: eventDepartment, viewType } = event.detail;
      console.log('Dashboard config updated event received:', eventDepartment, viewType);
      
      if (viewType === 'dashboard' && eventDepartment === userDepartment) {
        console.log('Reloading dashboard config after update');
        loadDashboardConfig();
      }
    };
    
    window.addEventListener('dashboard:config:updated', handleDashboardConfigUpdate as EventListener);
    return () => {
      window.removeEventListener('dashboard:config:updated', handleDashboardConfigUpdate as EventListener);
    };
  }, [loadDashboardConfig, userDepartment]);
  
  useEffect(() => {
    const loadUserDepartment = async () => {
      if (user) {
        const department = await getUserDepartment();
        setUserDepartment(department);
      }
    };
    
    loadUserDepartment();
  }, [user, getUserDepartment]);
  
  useEffect(() => {
    if (user) {
      loadDashboardConfig();
    }
  }, [user, loadDashboardConfig, userDepartment]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto">
          <BreadcrumbBar />
          <div className="max-w-7xl mx-auto p-6 pb-20 md:pb-6">
            <WelcomeCard
              title="Dashboard"
              description="Bem-vindo ao seu dashboard personalizado."
              icon={<Home className="h-6 w-6 mr-2" />}
              color="bg-gradient-to-r from-blue-800 to-blue-950"
              userName={firstName || 'Usuário'}
            />
            
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
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Dashboard;
