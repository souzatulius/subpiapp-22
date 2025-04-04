
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { User } from '@supabase/supabase-js';
import { getCommunicationActionCards } from './defaultCards';
import { supabase } from '@/integrations/supabase/client';
import { useDepartment } from './useDepartment';

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
    setCards(updatedCards);
    
    // Save user preferences if not in preview mode and user is logged in
    if (!isPreview && user) {
      supabase
        .from('user_dashboard')
        .upsert({
          user_id: user.id,
          cards_config: updatedCards,
          department_id: activeDepartment
        })
        .then(({ error }) => {
          if (error) console.error('Error saving card hide preference', error);
        });
    }
  };

  const handleSaveCardEdit = (updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    setCards(updatedCards);
    setIsEditModalOpen(false);
    
    // Save user preferences if not in preview mode and user is logged in
    if (!isPreview && user) {
      supabase
        .from('user_dashboard')
        .upsert({
          user_id: user.id,
          cards_config: updatedCards,
          department_id: activeDepartment
        })
        .then(({ error }) => {
          if (error) console.error('Error saving card edit', error);
        });
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
    setIsEditModalOpen
  };
};
