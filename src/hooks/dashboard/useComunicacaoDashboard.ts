
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { useCardStorage } from './useCardStorage';
import { useDefaultDashboardConfig } from './useDefaultDashboardConfig';

export const useComunicacaoDashboard = (user: User | null, isPreview = false, department = 'comunicacao') => {
  const [cards, setCards] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getDashboardCards, saveDashboardCards } = useCardStorage();
  const { getDefaultCards } = useDefaultDashboardConfig();

  // Load cards
  useEffect(() => {
    const loadCards = async () => {
      try {
        setIsLoading(true);
        
        if (isPreview) {
          // Use default cards for preview
          setCards(getDefaultCards(department));
        } else if (user) {
          // Get user's saved cards or defaults
          const savedCards = await getDashboardCards(user.id, department);
          if (savedCards && savedCards.length > 0) {
            setCards(savedCards);
          } else {
            setCards(getDefaultCards(department));
          }
        }
      } catch (error) {
        console.error('Error loading dashboard cards:', error);
        toast({
          title: "Erro ao carregar dashboard",
          description: "Não foi possível carregar os cards do dashboard.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, [user, department, isPreview, getDashboardCards, getDefaultCards]);

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Handle card edit
  const handleCardEdit = (id: string) => {
    const card = cards.find(c => c.id === id);
    if (card) {
      setSelectedCard(card);
      setIsEditModalOpen(true);
    }
  };

  // Handle card hide
  const handleCardHide = (id: string) => {
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, hidden: !card.hidden } : card
    );
    setCards(updatedCards);
    saveChanges(updatedCards);
  };

  // Save card edits
  const handleSaveCardEdit = (editedCard: any) => {
    const updatedCards = cards.map(card => 
      card.id === editedCard.id ? { ...card, ...editedCard } : card
    );
    setCards(updatedCards);
    setIsEditModalOpen(false);
    saveChanges(updatedCards);
  };

  // Handle cards reordering
  const handleCardsReorder = (reorderedCards: any[]) => {
    setCards(reorderedCards);
    saveChanges(reorderedCards);
  };

  // Save changes to storage
  const saveChanges = useCallback(async (updatedCards: any[]) => {
    if (user && !isPreview) {
      try {
        await saveDashboardCards(user.id, department, updatedCards);
      } catch (error) {
        console.error('Error saving dashboard changes:', error);
        toast({
          title: "Erro ao salvar alterações",
          description: "Não foi possível salvar as alterações no dashboard.",
          variant: "destructive"
        });
      }
    }
  }, [user, department, isPreview, saveDashboardCards]);

  // Reset dashboard to defaults
  const resetDashboard = useCallback(async () => {
    if (user && !isPreview) {
      const defaultCards = getDefaultCards(department);
      setCards(defaultCards);
      await saveChanges(defaultCards);
    }
  }, [user, department, isPreview, getDefaultCards, saveChanges]);

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
    setIsEditModalOpen,
    handleCardsReorder,
    resetDashboard
  };
};
