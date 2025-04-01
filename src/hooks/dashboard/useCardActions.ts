
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

  const handleDeleteCard = async (id: string) => {
    // Remove card from UI
    setActionCards((cards) => cards.filter((card) => card.id !== id));
    
    // Remove from database if user is logged in
    if (user) {
      try {
        // Get current cards config
        const { data: userData } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();
        
        if (userData) {
          // Parse cards, filter out the deleted one, and update
          const currentCards = JSON.parse(userData.cards_config);
          const updatedCards = currentCards.filter((card: ActionCardItem) => card.id !== id);
          
          await supabase
            .from('user_dashboard')
            .update({ 
              cards_config: JSON.stringify(updatedCards),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Erro ao remover card do banco de dados:', error);
      }
    }
    
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
    if (!user) {
      // Handle local-only functionality if not logged in
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
      return;
    }
    
    try {
      let updatedCards: ActionCardItem[];
      
      if (editingCard) {
        // Edit existing card
        updatedCards = actionCards.map(card => 
          card.id === editingCard.id 
            ? { ...card, ...cardData, isCustom: true }
            : card
        );
      } else {
        // Add new card
        const newCard = {
          id: `custom-${Date.now()}`,
          ...cardData,
          isCustom: true
        };
        
        updatedCards = [...actionCards, newCard];
      }
      
      // Update UI
      setActionCards(updatedCards);
      
      // Save to database
      const { data, error } = await supabase
        .from('user_dashboard')
        .select()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Update existing dashboard config
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(updatedCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Insert new dashboard config
        await supabase
          .from('user_dashboard')
          .insert({ 
            user_id: user.id,
            cards_config: JSON.stringify(updatedCards) 
          });
      }
      
      toast({
        title: editingCard ? "Card atualizado" : "Novo card adicionado",
        description: editingCard 
          ? "As alterações foram salvas com sucesso."
          : "O card foi criado com sucesso.",
        variant: "success",
      });
    } catch (error) {
      console.error('Erro ao salvar card:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o card. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCustomizationModalOpen(false);
      setEditingCard(null);
    }
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
