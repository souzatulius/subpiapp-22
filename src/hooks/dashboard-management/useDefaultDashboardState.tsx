
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDefaultDashboardConfig } from './useDefaultDashboardConfig';
import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';
import { useCardActions } from '../dashboard/useCardActions';

export const useDefaultDashboardState = (departmentId: string) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState('');
  const [specialCardsData, setSpecialCardsData] = useState({
    overdueCount: 0,
    overdueItems: [] as { title: string; id: string }[],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: false,
  });

  // Get the default dashboard configuration for the department
  const { config, loading: configLoading, saveConfig } = useDefaultDashboardConfig(departmentId);

  // Initialize cards from the configuration
  useEffect(() => {
    if (!configLoading && config) {
      setCards(config);
      setLoading(false);
    }
  }, [config, configLoading]);

  // Fetch department name
  useEffect(() => {
    const fetchDepartmentName = async () => {
      if (departmentId) {
        try {
          const { data, error } = await supabase
            .from('coordenacoes')
            .select('descricao')
            .eq('id', departmentId)
            .single();
          
          if (error) {
            console.error('Error fetching department name:', error);
            return;
          }
          
          if (data) {
            setDepartmentName(data.descricao);
          }
        } catch (error) {
          console.error('Failed to fetch department name:', error);
        }
      }
    };
    
    fetchDepartmentName();
  }, [departmentId]);

  // Card actions
  const {
    handleDeleteCard,
    handleEditCard,
  } = useCardActions(cards, setCards);

  // Save the cards to the database
  const saveCards = async () => {
    try {
      const result = await saveConfig(cards, departmentId);
      return result;
    } catch (error) {
      console.error('Error saving cards:', error);
      return false;
    }
  };

  return {
    cards,
    setCards,
    handleDeleteCard,
    handleEditCard,
    saveCards,
    loading,
    departmentName,
    specialCardsData,
  };
};
