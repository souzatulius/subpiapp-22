
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';
import { getDefaultCards } from './defaultCards';

export interface DashboardConfigResult {
  actionCards: ActionCardItem[];
  setActionCards: (cards: ActionCardItem[]) => void;
  isLoadingDashboard: boolean;
  viewType: 'dashboard' | 'communication';
}

export const useDashboardConfig = (
  userId: string | undefined, 
  userCoordenaticaoId: string | null, 
  isLoadingUser: boolean
): DashboardConfigResult => {
  const [defaultCards, setDefaultCards] = useState<ActionCardItem[]>([]);
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [viewType, setViewType] = useState<'dashboard' | 'communication'>('dashboard');
  
  // Determine view type based on URL
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.includes('comunicacao')) {
      setViewType('communication');
    } else {
      setViewType('dashboard');
    }
    console.log(`Current view type: ${pathname.includes('comunicacao') ? 'communication' : 'dashboard'}`);
  }, []);

  // Load default cards when user data is ready
  useEffect(() => {
    if (!isLoadingUser && userCoordenaticaoId) {
      const defaultCardsList = getDefaultCards(userCoordenaticaoId);
      setDefaultCards(defaultCardsList);
    }
  }, [isLoadingUser, userCoordenaticaoId]);
  
  // Load dashboard configuration
  useEffect(() => {
    const fetchCustomDashboard = async () => {
      if (!userId || !userCoordenaticaoId) return;
      
      setIsLoadingDashboard(true);
      console.log(`Loading dashboard for user: ${userId}, department: ${userCoordenaticaoId}, view type: ${viewType}`);
      
      try {
        // First check if there's a department dashboard
        const { data: deptDashboard, error: deptError } = await supabase
          .from('department_dashboards')
          .select('cards_config')
          .eq('department', userCoordenaticaoId)
          .eq('view_type', viewType)
          .maybeSingle();
        
        if (!deptError && deptDashboard?.cards_config) {
          try {
            const deptCards = JSON.parse(deptDashboard.cards_config);
            console.log('Loaded department dashboard:', deptCards);
            setActionCards(deptCards);
            setIsLoadingDashboard(false);
            return;
          } catch (e) {
            console.error('Error parsing department dashboard config:', e);
          }
        } else {
          console.log('No department dashboard found, checking user dashboard');
        }
        
        // If no department dashboard, try user's custom dashboard
        const { data: userDashboard, error: userError } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', userId)
          .eq('view_type', viewType)
          .maybeSingle();
        
        if (!userError && userDashboard?.cards_config) {
          try {
            const customCards = JSON.parse(userDashboard.cards_config);
            console.log('Loaded user dashboard:', customCards);
            setActionCards(customCards);
            setIsLoadingDashboard(false);
            return;
          } catch (e) {
            console.error('Error parsing user dashboard config:', e);
          }
        } else {
          console.log('No user dashboard found, checking default dashboard');
        }
        
        // If no custom dashboards found, check for default dashboard
        const { data: defaultDept, error: defaultError } = await supabase
          .from('department_dashboards')
          .select('cards_config')
          .eq('department', 'default')
          .eq('view_type', viewType)
          .maybeSingle();
          
        if (!defaultError && defaultDept?.cards_config) {
          try {
            const defaultCards = JSON.parse(defaultDept.cards_config);
            console.log('Loaded default dashboard:', defaultCards);
            setActionCards(defaultCards);
            setIsLoadingDashboard(false);
            return;
          } catch (e) {
            console.error('Error parsing default dashboard config:', e);
          }
        } else {
          console.log('No default dashboard found, using fallback cards');
        }
        
        // If all else fails, use the default cards
        console.log('Using fallback default cards');
        setActionCards(defaultCards);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        toast({
          title: "Erro ao carregar dashboard",
          description: "Não foi possível carregar a configuração do dashboard",
          variant: "destructive"
        });
        setActionCards(defaultCards);
      } finally {
        setIsLoadingDashboard(false);
      }
    };
    
    // Only fetch custom dashboard if user data is loaded
    if (!isLoadingUser && defaultCards.length > 0) {
      fetchCustomDashboard();
    }
  }, [userId, userCoordenaticaoId, isLoadingUser, defaultCards, viewType]);

  return {
    actionCards,
    setActionCards,
    isLoadingDashboard,
    viewType
  };
};
