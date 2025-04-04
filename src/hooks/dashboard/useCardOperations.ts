
import { useState } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';
import { useCardStorage } from './useCardStorage';

export const useCardOperations = (cards: ActionCardItem[], setCards: React.Dispatch<React.SetStateAction<ActionCardItem[]>>, user: any | null, userDepartment: string | null) => {
  const { saveCardConfig } = useCardStorage(user, userDepartment);

  const handleCardEdit = (card: ActionCardItem) => {
    const updatedCards = cards.map(c => 
      c.id === card.id ? { ...c, ...card } : c
    );
    
    setCards(updatedCards);
    
    if (user) {
      try {
        saveCardConfig(updatedCards);
      } catch (error) {
        console.error('Erro ao atualizar card:', error);
      }
    }
    
    return card;
  };

  const handleCardHide = (id: string) => {
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    if (user) {
      try {
        saveCardConfig(updatedCards)
          .then(success => {
            if (success) {
              toast({
                title: "Card ocultado",
                description: "O card foi ocultado do painel. Você pode restaurá-lo nas configurações.",
                variant: "default",
              });
            } else {
              setCards(cards);
              
              toast({
                title: "Erro",
                description: "Não foi possível ocultar o card. Tente novamente.",
                variant: "destructive",
              });
            }
          })
          .catch(error => {
            console.error('Erro ao ocultar card:', error);
            setCards(cards);
            
            toast({
              title: "Erro",
              description: "Não foi possível ocultar o card. Tente novamente.",
              variant: "destructive",
            });
          });
      } catch (error) {
        console.error('Erro ao ocultar card:', error);
        
        setCards(cards);
        
        toast({
          title: "Erro",
          description: "Não foi possível ocultar o card. Tente novamente.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Card ocultado",
        description: "O card foi ocultado temporariamente. Faça login para salvar suas configurações.",
        variant: "default",
      });
    }
  };

  return { handleCardEdit, handleCardHide };
};
