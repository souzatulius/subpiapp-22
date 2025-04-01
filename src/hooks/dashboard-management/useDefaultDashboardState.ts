
import { useState, useEffect } from 'react';
import { getDefaultCards } from '@/hooks/dashboard/defaultCards';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { FormSchema } from '@/components/dashboard/card-customization/types';
import { v4 as uuidv4 } from 'uuid';

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
    const fetchDashboardCards = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('department_dashboards')
          .select('cards_config')
          .eq('department', departmentId)
          .eq('view_type', 'dashboard')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching dashboard config:', error);
          setCards(getDefaultCards());
        } else if (data && data.cards_config) {
          try {
            const parsedCards = JSON.parse(data.cards_config);
            setCards(parsedCards);
          } catch (parseError) {
            console.error('Error parsing cards config JSON:', parseError);
            setCards(getDefaultCards());
          }
        } else {
          setCards(getDefaultCards());
        }
      } catch (err) {
        console.error('Failed to fetch dashboard cards:', err);
        setCards(getDefaultCards());
      } finally {
        setIsLoading(false);
      }
    };

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

    fetchDashboardCards();
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

  const handleSaveCard = (cardData: any) => {
    const newCardDefaults = {
      displayMobile: true,
      mobileOrder: cards.length,
      isCustom: true
    };

    if (editingCard) {
      setCards(cards.map(card =>
        card.id === editingCard.id ? { 
          ...card, 
          ...cardData,
          // Ensure iconId is set correctly
          iconId: cardData.iconId || card.iconId
        } : card
      ));
    } else {
      // Create a new card with required properties
      const newCard: ActionCardItem = {
        id: `card-${uuidv4()}`,
        title: cardData.title || 'Novo Card',
        path: cardData.path || '',
        color: cardData.color,
        width: cardData.width,
        height: cardData.height,
        iconId: cardData.iconId || 'clipboard-list',
        type: cardData.type || 'standard',
        ...newCardDefaults
      };
      
      setCards([...cards, newCard]);
    }
    
    setIsCustomizationModalOpen(false);
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
    handleQuickDemandSubmit: () => setNewDemandTitle(''),
    searchQuery,
    setSearchQuery,
    handleSearchSubmit: (q: string) => console.log('Searching for:', q)
  };
};
