
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  
  // Get the user's department
  const { userDepartment, isLoading: isDepartmentLoading } = useDepartment(user);
  
  // Use the department override if specified
  const activeDepartment = departmentOverride || userDepartment || 'comunicacao';

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      
      try {
        // First get default cards based on department
        const defaultCards = getCommunicationActionCards();
        
        // In preview mode, use default cards immediately
        if (isPreview || !user) {
          console.log('Loading default communication cards (preview or no user)');
          setCards(defaultCards);
          setIsLoading(false);
          return;
        }

        // Then try to fetch user customizations
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .eq('page', 'comunicacao')
          .maybeSingle();
        
        if (error) {
          console.log('Error fetching user dashboard:', error);
          setCards(defaultCards);
        } else if (data && data.cards_config) {
          try {
            const customCards = typeof data.cards_config === 'string' 
              ? JSON.parse(data.cards_config) 
              : data.cards_config;
            
            if (Array.isArray(customCards) && customCards.length > 0) {
              console.log('Using custom communication cards');
              setCards(customCards);
            } else {
              console.log('Custom cards invalid, using defaults');
              setCards(defaultCards);
            }
          } catch (e) {
            console.error('Error parsing cards config', e);
            setCards(defaultCards);
          }
        } else {
          console.log('No custom dashboard found, using defaults');
          setCards(defaultCards);
        }
      } catch (error) {
        console.error('Error fetching dashboard cards', error);
        setCards(getCommunicationActionCards());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCards();
  }, [user, isPreview, activeDepartment]);

  const handleCardEdit = (card: ActionCardItem) => {
    console.log('Editing card:', card);
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleCardHide = (id: string) => {
    console.log('Hiding card:', id);
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
          page: 'comunicacao',
          cards_config: JSON.stringify(updatedCards),
          department_id: activeDepartment
        })
        .then(({ error }) => {
          if (error) console.error('Error saving card hide preference', error);
        });
    }
  };

  const handleSaveCardEdit = (updatedCard: ActionCardItem) => {
    console.log('Saving edited card:', updatedCard);
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
          page: 'comunicacao',
          cards_config: JSON.stringify(updatedCards),
          department_id: activeDepartment
        })
        .then(({ error }) => {
          if (error) console.error('Error saving card edit', error);
        });
    }
  };

  return {
    cards,
    isEditModalOpen,
    selectedCard,
    isLoading: isLoading || isDepartmentLoading,
    handleCardEdit,
    handleCardHide,
    handleSaveCardEdit,
    setIsEditModalOpen
  };
};
