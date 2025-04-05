
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ActionCardItem, CardType, CardWidth, CardHeight, CardColor } from '@/types/dashboard';
import { useCardStorage } from './useCardStorage';
import { getBgColor } from './useCardColors';

// Define types to avoid circular references
interface CardAction {
  id: string;
  title: string;
  subtitle?: string;
  iconId: string;
  path: string;
  color: string;
  width?: CardWidth;
  height?: CardHeight;
  type: CardType;
  isQuickDemand?: boolean;
  displayMobile?: boolean;
  mobileOrder?: number;
}

export const useDashboardCards = () => {
  const [cards, setCards] = useLocalStorage<ActionCardItem[]>('dashboard-cards', []);
  const [editMode, setEditMode] = useState(false);
  const { saveCards, getCards } = useCardStorage();

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const addCard = (newCard: Omit<ActionCardItem, 'id'>) => {
    const card = {
      ...newCard,
      id: `card-${Date.now()}`,
      color: getBgColor(newCard.color || 'blue'),
    };
    
    const updatedCards = [...cards, card];
    setCards(updatedCards);
    saveCards(updatedCards);
  };

  const updateCard = (id: string, updatedData: Partial<ActionCardItem>) => {
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, ...updatedData } : card
    );
    setCards(updatedCards);
    saveCards(updatedCards);
  };

  const removeCard = (id: string) => {
    const updatedCards = cards.filter(card => card.id !== id);
    setCards(updatedCards);
    saveCards(updatedCards);
  };

  const reorderCards = (newOrder: ActionCardItem[]) => {
    setCards(newOrder);
    saveCards(newOrder);
  };

  useEffect(() => {
    const fetchCards = async () => {
      const storedCards = await getCards();
      if (storedCards && storedCards.length > 0) {
        setCards(storedCards);
      }
    };

    fetchCards();
  }, [getCards]);

  return {
    cards,
    editMode,
    toggleEditMode,
    addCard,
    updateCard,
    removeCard,
    reorderCards
  };
};
