
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDefaultDashboardConfig } from './useDefaultDashboardConfig';
import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';
import { useCardActions } from '../dashboard/useCardActions';
import { toast } from '@/components/ui/use-toast';
import { getDefaultCards } from '@/hooks/dashboard/defaultCards';

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
    version: '1.0' // Adding version for future migrations
  });

  // Get the default dashboard configuration for the department
  const { config, loading: configLoading, saveConfig } = useDefaultDashboardConfig(departmentId);

  // Initialize cards from the configuration
  useEffect(() => {
    if (!configLoading && config) {
      console.log("Configuração carregada para departamento", departmentId, ":", config);
      
      // Add version field if it doesn't exist
      const configWithVersion = Array.isArray(config) ? 
        config.map(card => ({
          ...card,
          version: card.version || '1.0'
        })) : 
        getDefaultCards(departmentId);
      
      setCards(configWithVersion);
      setLoading(false);
    }
  }, [config, configLoading, departmentId]);

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
      console.log("Salvando cards para departamento", departmentId, ":", cards);
      
      // Ensure all cards have the version field
      const cardsWithVersion = cards.map(card => ({
        ...card,
        version: card.version || '1.0'
      }));

      const result = await saveConfig(cardsWithVersion, departmentId);
      
      if (result) {
        toast({
          title: "Dashboard salvo",
          description: "As configurações do dashboard foram salvas com sucesso",
          variant: "success"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error saving cards:', error);
      toast({
        title: "Erro ao salvar dashboard",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Function to hide a card (mark it as not visible)
  const hideCard = (cardId: string) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId 
          ? { ...card, hidden: true } 
          : card
      )
    );
  };

  // Function to show a hidden card
  const showCard = (cardId: string) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId 
          ? { ...card, hidden: false } 
          : card
      )
    );
  };

  // Function to reorder cards
  const reorderCards = (reorderedCards: ActionCardItem[]) => {
    console.log("Reordenando cards:", reorderedCards);
    setCards(reorderedCards);
  };

  return {
    cards,
    setCards,
    handleDeleteCard,
    handleEditCard,
    hideCard,
    showCard,
    reorderCards,
    saveCards,
    loading,
    departmentName,
    specialCardsData,
  };
};
