
import { useState, useEffect } from 'react';
import { defaultCards } from '@/hooks/dashboard/defaultCards';
import { supabase } from '@/integrations/supabase/client';

export const useDefaultDashboardState = (departmentId: string) => {
  const [cards, setCards] = useState([]);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [specialCardsData, setSpecialCardsData] = useState({});
  const [departmentName, setDepartmentName] = useState('');

  useEffect(() => {
    // Default cards will be loaded initially
    const loadInitialCards = () => {
      setCards(defaultCards);
    };

    loadInitialCards();
    
    // If we have a specific department, load its name
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

  const handleEditCard = (card) => {
    setEditingCard(card);
    setIsCustomizationModalOpen(true);
  };

  const handleDeleteCard = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsCustomizationModalOpen(true);
  };

  const handleSaveCard = (cardData) => {
    if (editingCard) {
      // Edit existing card
      setCards(cards.map(card => 
        card.id === editingCard.id ? { ...card, ...cardData } : card
      ));
    } else {
      // Add new card
      setCards([...cards, { id: `card-${Date.now()}`, ...cardData }]);
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
    departmentName
  };
};
