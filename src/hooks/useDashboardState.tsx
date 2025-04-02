
import { useDashboardData } from './dashboard/useDashboardData';
import { useCardActions } from './dashboard/useCardActions';
import { useSpecialCardActions } from './dashboard/useSpecialCardActions';
import { useSpecialCardsData } from './dashboard/useSpecialCardsData';
import { DashboardStateReturn } from './dashboard/types';
import { getDefaultCards } from './dashboard/defaultCards';
import { useState, useEffect } from 'react';
import { ActionCardItem, DataSourceKey } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDashboardState = (userId?: string): DashboardStateReturn => {
  const [defaultCards, setDefaultCards] = useState<ActionCardItem[]>([]);
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([]);
  const [firstName, setFirstName] = useState('');
  const [userCoordenaticaoId, setUserCoordenaticaoId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
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
  
  // Fetch user's info and coordenação
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setIsLoadingUser(false);
        return;
      }
      
      setIsLoadingUser(true);
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('nome_completo, coordenacao_id')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching user info:', error);
          return;
        }
        
        if (data) {
          // Extract first name
          const firstName = data.nome_completo.split(' ')[0];
          setFirstName(firstName);
          setUserCoordenaticaoId(data.coordenacao_id);
          
          // Load default cards based on the user's department
          const defaultCardsList = getDefaultCards(data.coordenacao_id);
          setDefaultCards(defaultCardsList);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserInfo();
  }, [userId]);
  
  // Then try to load custom dashboard if available
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
    if (!isLoadingUser) {
      fetchCustomDashboard();
    }
  }, [userId, userCoordenaticaoId, isLoadingUser, defaultCards, viewType]);
  
  // Try to load data if userId is provided
  useDashboardData(
    'pendencias_por_coordenacao',
    userId || '',
    userId || ''
  );
  
  // Card manipulation actions
  const {
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard
  } = useCardActions(actionCards, setActionCards, userCoordenaticaoId || '');
  
  // Special card actions (search and quick demand)
  const {
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  } = useSpecialCardActions();
  
  // Fetch data for special cards
  const specialCardsData = useSpecialCardsData();

  return {
    firstName,
    actionCards,
    setActionCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    specialCardsData,
    userCoordenaticaoId,
    isLoadingDashboard
  };
};
