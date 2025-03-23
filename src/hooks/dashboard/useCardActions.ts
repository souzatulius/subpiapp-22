
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ActionCardItem } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useCardActions = (
  actionCards: ActionCardItem[],
  setActionCards: React.Dispatch<React.SetStateAction<ActionCardItem[]>>
) => {
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);
  const { user } = useAuth();

  const handleDeleteCard = (id: string) => {
    setActionCards((cards) => cards.filter((card) => card.id !== id));
    
    toast({
      title: "Card removido",
      description: "O card foi removido com sucesso.",
      variant: "success",
    });
  };

  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsCustomizationModalOpen(true);
  };

  const handleEditCard = (card: ActionCardItem) => {
    setEditingCard(card);
    setIsCustomizationModalOpen(true);
  };

  const handleSaveCard = async (cardData: Omit<ActionCardItem, 'id'>) => {
    if (editingCard) {
      // Edit existing card
      const updatedCards = actionCards.map(card => 
        card.id === editingCard.id 
          ? { ...card, ...cardData, isCustom: true }
          : card
      );
      
      setActionCards(updatedCards);
      
      toast({
        title: "Card atualizado",
        description: "As alterações foram salvas com sucesso.",
        variant: "success",
      });
    } else {
      // Add new card
      const newCard = {
        id: `custom-${Date.now()}`,
        ...cardData,
        isCustom: true
      };
      
      setActionCards(cards => [...cards, newCard]);
      
      toast({
        title: "Novo card adicionado",
        description: "O card foi criado com sucesso.",
        variant: "success",
      });
    }
    
    setIsCustomizationModalOpen(false);
    setEditingCard(null);
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
