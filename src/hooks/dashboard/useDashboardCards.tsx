// src/hooks/dashboard/useUserDashboardCards.tsx
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { getCommunicationActionCards, getDefaultDashboardCards } from '@/hooks/dashboard/defaultCards';
import { supabase } from '@/integrations/supabase/client';

// Função que retorna os cards padrão conforme o departamento
const getDefaultCards = (department: string) => {
  if (department === 'comunicacao') {
    return getCommunicationActionCards();
  }
  return getDefaultDashboardCards();
};

export const useUserDashboardCards = (
  user: any, 
  department: string = 'default', 
  isPreview: boolean = false
) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      if (isPreview) {
        setCards(getDefaultCards(department));
        setIsLoading(false);
        return;
      }
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        // Define os cards padrão para feedback imediato
        const defaultCards = getDefaultCards(department);
        setCards(defaultCards);
        // Busca customizações do usuário
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .eq('department_id', department)
          .single();
        if (!error && data && data.cards_config) {
          const customCards = typeof data.cards_config === 'string' 
            ? JSON.parse(data.cards_config) 
            : data.cards_config;
          if (Array.isArray(customCards) && customCards.length > 0) {
            setCards(customCards);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar os cards do dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    fetchCards();
  }, [user, department, isPreview]);

  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  const handleCardEdit = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleCardHide = (id: string) => {
    const updatedCards = cards.map(card => card.id === id ? { ...card, isHidden: true } : card);
    setCards(updatedCards);
    if (!isPreview && user) {
      supabase.from('user_dashboard')
        .upsert({
          user_id: user.id,
          cards_config: JSON.stringify(updatedCards),
          department_id: department
        })
        .then(({ error }) => {
          if (error) console.error("Erro ao salvar preferência de ocultar card", error);
        });
    }
  };

  const handleSaveCardEdit = (updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => card.id === updatedCard.id ? updatedCard : card);
    setCards(updatedCards);
    setIsEditModalOpen(false);
    if (!isPreview && user) {
      supabase.from('user_dashboard')
        .upsert({
          user_id: user.id,
          cards_config: JSON.stringify(updatedCards),
          department_id: department
        })
        .then(({ error }) => {
          if (error) console.error("Erro ao salvar edição do card", error);
        });
    }
  };

  const updateCardsOrder = (newCardsOrder: ActionCardItem[]) => {
    setCards(newCardsOrder);
    if (!isPreview && user) {
      supabase.from('user_dashboard')
        .upsert({
          user_id: user.id,
          cards_config: JSON.stringify(newCardsOrder),
          department_id: department
        })
        .then(({ error }) => {
          if (error) console.error("Erro ao salvar nova ordem dos cards", error);
        });
    }
  };

  return {
    cards,
    isLoading,
    isEditMode,
    toggleEditMode,
    isEditModalOpen,
    selectedCard,
    handleCardEdit,
    handleCardHide,
    handleSaveCardEdit,
    updateCardsOrder,
    setIsEditModalOpen,
    setCards
  };
};

export default useUserDashboardCards;
