import { useState, useEffect } from 'react';
import { getDefaultCards } from '@/hooks/dashboard/defaultCards';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/hooks/dashboard/types';

export const useDefaultDashboardState = (departmentId: string) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);
  const [specialCardsData, setSpecialCardsData] = useState({
    overdueCount: 0,
    overdueItems: [] as { title: string; id: string }[],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: false
  });
  const [departmentName, setDepartmentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newDemandTitle, setNewDemandTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadInitialCards = () => {
      setCards(getDefaultCards());
    };

    loadInitialCards();

    const fetchDepartmentName = async () => {
      if (departmentId && departmentId !== 'default') {
        try {
          const { data, error } = await supabase
            .from('areas_coordenacao')
            .select('descricao')
            .eq('id', departmentId)
            .single();

          if (error) {
            console.error('Error fetching department name:', error);
            return;
          }

          if (data) {
            setDepartmentName(data.descricao);
          }
        } catch (error) {
          console.error('Failed to fetch department name:', error);
        }
      } else {
        setDepartmentName(departmentId === 'default' ? 'Padrão (Todos)' : '');
      }
    };

    fetchDepartmentName();
  }, [departmentId]);

  const handleEditCard = (card: ActionCardItem) => {
    setEditingCard(card);
    setIsCustomizationModalOpen(true);
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsCustomizationModalOpen(true);
  };

  const handleSaveCard = (cardData: Partial<ActionCardItem>) => {
    const newCardDefaults = {
      displayMobile: true,
      mobileOrder: cards.length
    };

    if (editingCard) {
      // Edit existing card
      setCards(cards.map(card =>
        card.id === editingCard.id ? { ...card, ...cardData } : card
      ));
    } else {
      // Add new card
      setCards([
        ...cards,
        {
          id: `card-${Date.now()}`,
          ...newCardDefaults,
          ...cardData
        } as ActionCardItem
      ]);
    }
    setIsCustomizationModalOpen(false);
  };

  const handleQuickDemandSubmit = () => {
    console.log('Submitting quick demand:', newDemandTitle);
    setNewDemandTitle('');
  };

  const handleSearchSubmit = (query: string) => {
    console.log('Searching for:', query);
  };

  return {
    cards,
    setCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    specialCardsData,
    departmentName,
    isLoading,
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  };
};
