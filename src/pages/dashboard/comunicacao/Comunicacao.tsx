
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { MessageSquareReply, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { toast } from '@/components/ui/use-toast';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { supabase } from '@/integrations/supabase/client';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';
import { useUserData } from '@/hooks/dashboard/useUserData';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ 
  isPreview = false, 
  department = 'comunicacao' 
}) => {
  const { user } = useAuth();
  const { firstName } = useUserData(user?.id);
  const isMobile = useIsMobile();
  
  const [dashboardCards, setDashboardCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [configSource, setConfigSource] = useState<'default' | 'custom'>('default');
  
  // Get user department from user profile
  const getUserDepartment = useCallback(async () => {
    if (!user && !isPreview) return department;
    
    if (isPreview) return department;
    
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('coordenacao_id')
        .eq('id', user!.id)
        .single();
        
      if (error) {
        console.error('Error fetching user department:', error);
        return 'comunicacao'; // Default for communication dashboard
      }
      
      // If the user doesn't have a department, assign them to 'comunicacao'
      if (!data?.coordenacao_id || data.coordenacao_id === 'default') {
        console.log('User has no department or has default department, using comunicacao');
        return 'comunicacao';
      }
      
      return data.coordenacao_id;
    } catch (e) {
      console.error('Error in getUserDepartment:', e);
      return 'comunicacao';
    }
  }, [user, isPreview, department]);
  
  // Load communication dashboard configuration
  const loadDashboardConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      // If preview mode, use provided department, otherwise use user's department
      const departmentId = isPreview 
        ? department 
        : userDepartment || 'comunicacao';
      const viewType = 'communication';
        
      console.log('Loading communication dashboard config for department:', departmentId, 'viewType:', viewType);
      
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
          console.log('Loaded department-specific communication dashboard cards:', config.length);
          
          // Ensure proper type for dynamic cards
          const processedCards = config.map((card: ActionCardItem) => {
            if (card.dataSourceKey) {
              return {...card, type: 'data_dynamic'};
            }
            return card;
          });
          
          setDashboardCards(processedCards);
          setConfigSource('custom');
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing communication dashboard config:', e);
          fetchDefaultConfig();
        }
      } else {
        // If no department-specific config or error, fall back to default
        console.log('No department-specific config or error occurred, falling back to default');
        fetchDefaultConfig();
      }
    } catch (e) {
      console.error('Error in loadDashboardConfig:', e);
      setDashboardCards([]);
      setIsLoading(false);
    }
  }, [isPreview, department, userDepartment]);
  
  // Get default dashboard config as fallback
  const fetchDefaultConfig = async () => {
    try {
      console.log('Fetching default communication dashboard config');
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', 'default')
        .eq('view_type', 'communication')
        .maybeSingle();
        
      if (!error && data && data.cards_config) {
        try {
          const config = JSON.parse(data.cards_config);
          console.log('Loaded default communication dashboard cards:', config.length);
          
          // Ensure proper type for dynamic cards
          const processedCards = config.map((card: ActionCardItem) => {
            if (card.dataSourceKey) {
              return {...card, type: 'data_dynamic'};
            }
            return card;
          });
          
          setDashboardCards(processedCards);
          setConfigSource('default');
        } catch (e) {
          console.error('Error parsing default communication dashboard config:', e);
          setDashboardCards([]);
        }
      } else {
        console.log('No default communication dashboard config found, using empty array');
        setDashboardCards([]);
      }
    } catch (e) {
      console.error('Error in fetchDefaultConfig:', e);
      setDashboardCards([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Listen for dashboard config updates from DashboardManagementContent
  useEffect(() => {
    const handleDashboardConfigUpdate = (event: CustomEvent<{department: string, viewType: string}>) => {
      const { department: eventDepartment, viewType } = event.detail;
      console.log('Dashboard config updated event received:', eventDepartment, viewType);
      
      if (viewType === 'communication' && 
         (eventDepartment === userDepartment || 
          (isPreview && eventDepartment === department))) {
        console.log('Reloading communication dashboard config after update');
        loadDashboardConfig();
      }
    };
    
    window.addEventListener('dashboard:config:updated', handleDashboardConfigUpdate as EventListener);
    return () => {
      window.removeEventListener('dashboard:config:updated', handleDashboardConfigUpdate as EventListener);
    };
  }, [loadDashboardConfig, userDepartment, department, isPreview]);
  
  // Load user department when user is available
  useEffect(() => {
    const loadUserDepartment = async () => {
      const department = await getUserDepartment();
      setUserDepartment(department);
    };
    
    if (user || isPreview) {
      loadUserDepartment();
    }
  }, [user, isPreview, getUserDepartment]);
  
  // Load dashboard config when user department changes
  useEffect(() => {
    if (userDepartment || isPreview) {
      loadDashboardConfig();
    }
  }, [userDepartment, isPreview, loadDashboardConfig]);

  // Show loading state if user data is needed but not available
  if (!isPreview && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <span className="text-blue-600 font-medium text-lg">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <WelcomeCard
          title="Comunicação"
          description="Gerencie demandas e notas oficiais"
          icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />
      </div>
      
      {/* Display communication dashboard cards */}
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
              isLoading: false,
              kpis: {
                pressRequests: {
                  today: 14,
                  yesterday: 12,
                  percentageChange: 16.7,
                  loading: false
                },
                pendingApproval: {
                  total: 8,
                  awaitingResponse: 5,
                  loading: false
                },
                notesProduced: {
                  total: 42,
                  approved: 38,
                  rejected: 4,
                  loading: false
                }
              },
              lists: {
                recentDemands: {
                  items: [
                    { id: 'dem-1', title: 'Demanda de exemplo 1', status: 'in-progress' as const, date: '2023-12-01', path: '#' },
                    { id: 'dem-2', title: 'Demanda de exemplo 2', status: 'pending' as const, date: '2023-12-02', path: '#' }
                  ],
                  loading: false
                },
                recentNotes: {
                  items: [
                    { id: 'note-1', title: 'Nota de exemplo 1', status: 'approved' as const, date: '2023-12-01', path: '#' },
                    { id: 'note-2', title: 'Nota de exemplo 2', status: 'pending' as const, date: '2023-12-02', path: '#' }
                  ],
                  loading: false
                }
              },
              originOptions: [
                { id: 'origin-1', title: 'Imprensa', icon: '📰' },
                { id: 'origin-2', title: 'Ministério', icon: '🏛️' },
                { id: 'origin-3', title: 'Interno', icon: '🏢' }
              ]
            }}
          />
        ) : (
          <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">Nenhum card configurado para exibição.</p>
          </div>
        )}
      </div>
      
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
