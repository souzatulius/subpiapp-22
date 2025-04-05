
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { getCommunicationActionCards } from './defaultCards';

export const useComunicacaoDashboard = (
  user: User | null,
  isPreview = false,
  department = 'comunicacao'
) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      
      if (isPreview || !user) {
        // For preview mode or unauthenticated users, load default cards
        const defaultCards = getCommunicationActionCards();
        setCards(defaultCards);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config, department_id')
          .eq('user_id', user.id)
          .eq('department_id', department)
          .single();
        
        if (error || !data || !data.cards_config) {
          // No saved configuration, use default
          const defaultCards = getCommunicationActionCards();
          setCards(defaultCards);
          
          // Create user dashboard record with default config
          if (!isPreview && user) {
            await supabase.from('user_dashboard').upsert({
              user_id: user.id,
              department_id: department,
              cards_config: JSON.stringify(defaultCards),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        } else {
          // Parse JSON if needed
          const userCards = typeof data.cards_config === 'string' 
            ? JSON.parse(data.cards_config) 
            : data.cards_config;
            
          setCards(userCards);
        }
      } catch (error) {
        console.error('Error fetching communication dashboard settings:', error);
        // Fallback to default cards
        const defaultCards = getCommunicationActionCards();
        setCards(defaultCards);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCards();
  }, [user, department, isPreview]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCardEdit = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleSaveCardEdit = async (updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? { ...updatedCard } : card
    );
    
    setCards(updatedCards);
    setIsEditModalOpen(false);
    setSelectedCard(null);
    
    // Save to database if user is logged in
    if (!isPreview && user) {
      try {
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(updatedCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('department_id', department);
      } catch (error) {
        console.error('Error saving card updates:', error);
      }
    }
  };

  const handleCardHide = async (cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    // Save to database if user is logged in
    if (!isPreview && user) {
      try {
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(updatedCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('department_id', department);
      } catch (error) {
        console.error('Error saving card visibility:', error);
      }
    }
  };

  const handleCardsReorder = async (updatedCards: ActionCardItem[]) => {
    setCards(updatedCards);
    
    // Save to database if user is logged in
    if (!isPreview && user) {
      try {
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(updatedCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('department_id', department);
      } catch (error) {
        console.error('Error saving card order:', error);
      }
    }
  };

  const resetDashboard = async () => {
    const defaultCards = getCommunicationActionCards();
    setCards(defaultCards);
    
    // Save to database if user is logged in
    if (!isPreview && user) {
      try {
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(defaultCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('department_id', department);
      } catch (error) {
        console.error('Error resetting dashboard:', error);
      }
    }
  };

  return {
    cards,
    isLoading,
    isEditMode,
    isEditModalOpen,
    selectedCard,
    toggleEditMode,
    handleCardEdit,
    handleCardHide,
    handleSaveCardEdit,
    setIsEditModalOpen,
    handleCardsReorder,
    resetDashboard
  };
};
