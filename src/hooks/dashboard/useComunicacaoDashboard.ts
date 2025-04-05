
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { User } from '@supabase/supabase-js';
import { getCommunicationActionCards } from './defaultCards';
import { supabase } from '@/integrations/supabase/client';
import { useDepartment } from './useDepartment';
import { toast } from '@/hooks/use-toast';

export const useComunicacaoDashboard = (
  user: User | null, 
  isPreview = false,
  departmentOverride = 'comunicacao'
) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  
  // Get the user's department
  const { userDepartment, isLoading: isDepartmentLoading } = useDepartment(user);
  
  // Use the department override if specified
  const activeDepartment = departmentOverride || userDepartment;

  useEffect(() => {
    const fetchCards = async () => {
      if (isPreview) {
        // In preview mode, use default cards immediately
        setCards(getCommunicationActionCards());
        setIsLoading(false);
        return;
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // First get default cards based on department
        const defaultCards = getCommunicationActionCards();
        
        // Then try to fetch user customizations
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .eq('page', 'comunicacao')
          .single();
        
        if (error) {
          console.log('No custom dashboard found, using defaults');
          setCards(defaultCards);
        } else if (data && data.cards_config) {
          try {
            const customCards = typeof data.cards_config === 'string' 
              ? JSON.parse(data.cards_config) 
              : data.cards_config;
            
            if (Array.isArray(customCards) && customCards.length > 0) {
              setCards(customCards);
            } else {
              setCards(defaultCards);
            }
          } catch (e) {
            console.error('Error parsing cards config', e);
            setCards(defaultCards);
          }
        } else {
          setCards(defaultCards);
        }
      } catch (error) {
        console.error('Error fetching dashboard cards', error);
        // Fallback to default cards on error
        setCards(getCommunicationActionCards());
      } finally {
        setIsLoading(false);
      }
    };

    // Start loading
    setIsLoading(true);
    
    // Short timeout to ensure default cards are set even if fetch fails
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Loading timeout reached, using default cards');
        setCards(getCommunicationActionCards());
        setIsLoading(false);
      }
    }, 2000);
    
    fetchCards();
    
    return () => clearTimeout(timeoutId);
  }, [user, isPreview, activeDepartment]);

  const persistCards = async (updatedCards: ActionCardItem[]) => {
    if (!user || isPreview) return;
    
    // Create a distinct clone to avoid mutation issues
    const cardsCopy = JSON.parse(JSON.stringify(updatedCards));
    setCards(cardsCopy);

    try {
      await supabase
        .from('user_dashboard')
        .upsert({
          user_id: user.id,
          page: 'comunicacao',
          cards_config: JSON.stringify(cardsCopy),
          department_id: activeDepartment || 'default'
        });
    } catch (error) {
      console.error('Erro ao salvar configuração de cards:', error);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCardEdit = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleCardHide = (id: string) => {
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, isHidden: true } : card
    );
    persistCards(updatedCards);
  };

  const handleSaveCardEdit = (updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    persistCards(updatedCards);
    setIsEditModalOpen(false);
    
    toast({
      title: "Card atualizado",
      description: "As alterações foram salvas com sucesso.",
      variant: "default"
    });
  };

  const handleCardsReorder = (updatedCards: ActionCardItem[]) => {
    persistCards(updatedCards);
  };

  const resetDashboard = async () => {
    if (!user || isPreview) return;
    
    // Get default cards for the communication dashboard
    const defaultCards = getCommunicationActionCards();
    
    // Set cards to defaults
    setCards(defaultCards);
    
    try {
      // Remove custom configuration from database
      await supabase
        .from('user_dashboard')
        .delete()
        .eq('user_id', user.id)
        .eq('page', 'comunicacao');
    } catch (error) {
      console.error('Erro ao resetar dashboard:', error);
    }
  };

  return {
    cards,
    isEditMode,
    isEditModalOpen,
    selectedCard,
    isLoading,
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen,
    handleCardsReorder,
    resetDashboard
  };
};
