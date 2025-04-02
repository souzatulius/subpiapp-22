
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
import { useUserData } from '@/hooks/useUserData';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ 
  isPreview = false, 
  department = 'comunicacao' 
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { profile } = useUserData();
  
  const [dashboardCards, setDashboardCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load communication dashboard configuration
  const loadDashboardConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      // If preview mode, use provided department, otherwise use user's department
      const departmentId = isPreview 
        ? department 
        : profile?.coordenacao_id || 'comunicacao';
        
      console.log('Loading communication dashboard config for department:', departmentId);
      
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', departmentId)
        .eq('view_type', 'communication') // Communication view type
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading communication dashboard config:', error);
        setDashboardCards([]);
      } else if (data && data.cards_config) {
        try {
          // Parse the configuration and set cards
          const config = JSON.parse(data.cards_config);
          console.log('Loaded communication dashboard cards:', config.length);
          setDashboardCards(config);
        } catch (e) {
          console.error('Error parsing communication dashboard config:', e);
          setDashboardCards([]);
        }
      } else {
        console.log('No communication dashboard config found, using empty array');
        setDashboardCards([]);
      }
    } catch (e) {
      console.error('Error in loadDashboardConfig:', e);
      setDashboardCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [isPreview, department, profile?.coordenacao_id]);
  
  useEffect(() => {
    if (user || isPreview) {
      loadDashboardConfig();
    }
  }, [user, isPreview, loadDashboardConfig]);

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
      <WelcomeCard
        title="Comunicação"
        description="Gerencie demandas e notas oficiais"
        icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-500 to-blue-700"
      />
      
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
              isLoading: false
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
