
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
          .select('cards_config')
          .eq('user_id', user.id)
          .eq('department', department)
          .single();
        
        if (error || !data) {
          // No saved configuration, use default
          const defaultCards = getCommunicationActionCards();
          setCards(defaultCards);
          
          // Create user dashboard record with default config
          if (!isPreview && user) {
            await supabase.from('user_dashboard').upsert({
              user_id: user.id,
              department: department,
              cards_config: JSON.stringify(defaultCards),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        } else {
          // Use saved configuration
          try {
            const savedCards = JSON.parse(data.cards_config);
            setCards(Array.isArray(savedCards) ? savedCards : getCommunicationActionCards());
          } catch (e) {
            console.error('Error parsing saved cards configuration:', e);
            setCards(getCommunicationActionCards());
          }
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
    if (!updatedCard || !cards) return;
    
    const updatedCards = cards.map((card) => 
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
          .eq('department', department);
      } catch (error) {
        console.error('Error saving card updates:', error);
      }
    }
  };

  const handleCardHide = async (cardId: string) => {
    if (!cardId || !cards) return;
    
    const updatedCards = cards.map((card) => 
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
          .eq('department', department);
      } catch (error) {
        console.error('Error saving card visibility:', error);
      }
    }
  };

  // Fixed the infinite type recursion by properly handling the parameter type
  const handleCardsReorder = async (newCards: ActionCardItem[]) => {
    setCards(newCards);
    
    // Save to database if user is logged in
    if (!isPreview && user) {
      try {
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(newCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('department', department);
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
          .eq('department', department);
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
