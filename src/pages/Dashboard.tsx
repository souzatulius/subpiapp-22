
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { firstName } = useDashboardState();
  
  const [dashboardCards, setDashboardCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [configSource, setConfigSource] = useState<'default' | 'custom'>('default');
  const [debugInfo, setDebugInfo] = useState({ viewType: 'dashboard', departmentId: '', isDefault: true });
  
  // Get user department from user profile
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
  
  // Load dashboard configuration based on user's department
  const loadDashboardConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      // Determine the user's department ID, fall back to default if not available
      const departmentId = userDepartment || 'default';
      const viewType = 'dashboard';
      
      console.log('Loading dashboard config for department:', departmentId, 'viewType:', viewType);
      setDebugInfo({ viewType, departmentId, isDefault: departmentId === 'default' });
      
      // First try to get department-specific config
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', departmentId)
        .eq('view_type', viewType)
        .maybeSingle();
        
      if (!error && data && data.cards_config) {
        try {
          // Parse the configuration and set cards
          const config = JSON.parse(data.cards_config);
          console.log('Loaded department-specific dashboard cards:', config.length);
          setDashboardCards(config);
          setConfigSource('custom');
          setDebugInfo(prev => ({ ...prev, isDefault: false }));
        } catch (e) {
          console.error('Error parsing dashboard config:', e);
          fetchDefaultConfig();
        }
      } else {
        // If no department-specific config or error, fall back to default
        fetchDefaultConfig();
      }
    } catch (e) {
      console.error('Error in loadDashboardConfig:', e);
      setDashboardCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [userDepartment]);
  
  // Get default dashboard config as fallback
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
          setDebugInfo(prev => ({ ...prev, isDefault: true }));
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
  
  // Listen for dashboard config updates from DashboardManagementContent
  useEffect(() => {
    const handleDashboardConfigUpdate = (event: CustomEvent) => {
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
  
  // Load user department when user is available
  useEffect(() => {
    const loadUserDepartment = async () => {
      if (user) {
        const department = await getUserDepartment();
        setUserDepartment(department);
      }
    };
    
    loadUserDepartment();
  }, [user, getUserDepartment]);
  
  // Load dashboard config when user department changes
  useEffect(() => {
    if (user) {
      loadDashboardConfig();
    }
  }, [user, loadDashboardConfig, userDepartment]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const DebugBadge = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="absolute top-2 right-2 z-10 bg-white/50 hover:bg-white/80 cursor-help">
            {configSource === 'custom' ? 'Custom' : 'Default'}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-sm bg-black/90 text-white p-3">
          <div className="space-y-1 text-xs">
            <p><strong>ViewType:</strong> {debugInfo.viewType}</p>
            <p><strong>Department:</strong> {debugInfo.departmentId}</p>
            <p><strong>Config:</strong> {debugInfo.isDefault ? 'Default' : 'Custom'}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto">
          <BreadcrumbBar />
          <div className="max-w-7xl mx-auto p-6 pb-20 md:pb-6">
            <div className="relative">
              <DebugBadge />
              <WelcomeCard
                title={`Olá, ${firstName}!`}
                description="Bem-vindo ao seu dashboard personalizado."
                icon={<Home className="h-6 w-6 mr-2" />}
                color="bg-gradient-to-r from-blue-800 to-blue-950"
              />
            </div>
            
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
