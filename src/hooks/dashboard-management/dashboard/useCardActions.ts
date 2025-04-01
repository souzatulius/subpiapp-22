
import { useState } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';

export const useCardActions = (
  cards: ActionCardItem[],
  setCards: React.Dispatch<React.SetStateAction<ActionCardItem[]>>
) => {
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);

  const handleDeleteCard = (id: string) => {
    console.log("Deleting card with ID:", id);
    setCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  const handleAddNewCard = () => {
    console.log("Creating new card template");
    const newCardTemplate: ActionCardItem = {
      id: `card-${uuidv4()}`,
      title: 'Novo Card',
      iconId: 'Layout',
      path: '',
      color: 'blue',
      type: 'standard',
      width: '25',
      height: '1',
      isCustom: true,
      displayMobile: true,
      mobileOrder: cards.length,
      version: '1.0'
    };
    
    setEditingCard(newCardTemplate);
    setIsCustomizationModalOpen(true);
  };

  const handleEditCard = (card: ActionCardItem) => {
    console.log("Editing card:", card);
    setEditingCard(card);
    setIsCustomizationModalOpen(true);
  };

  const handleSaveCard = (data: Partial<ActionCardItem>) => {
    console.log("Saving card data:", data);
    
    if (editingCard) {
      // Update existing card
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === editingCard.id ? { ...card, ...data } : card
        )
      );
    } else {
      // Create new card
      const newCard: ActionCardItem = {
        id: `card-${uuidv4()}`,
        title: data.title || 'Novo Card',
        iconId: data.iconId || 'Layout',
        path: data.path || '',
        color: data.color || 'blue',
        type: data.type || 'standard',
        width: data.width || '25',
        height: data.height || '1',
        isCustom: true,
        displayMobile: data.displayMobile === undefined ? true : data.displayMobile,
        mobileOrder: cards.length,
        ...data
      };
      
      setCards(prevCards => [...prevCards, newCard]);
    }
    
    setEditingCard(null);
    setIsCustomizationModalOpen(false);
  };

  return {
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard
  };
};
