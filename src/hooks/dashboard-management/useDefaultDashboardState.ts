
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/components/ui/use-toast';

export const useDefaultDashboardState = (departmentId: string = 'default', viewType: 'dashboard' | 'communication' = 'dashboard') => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);
  const [configSource, setConfigSource] = useState<'default' | 'custom'>('default');
  
  // Mock data for demo purposes
  const [specialCardsData, setSpecialCardsData] = useState({
    overdueCount: 12,
    overdueItems: [
      { title: 'Demanda atrasada 1', id: 'overdue-1' },
      { title: 'Demanda atrasada 2', id: 'overdue-2' },
    ],
    notesToApprove: 5,
    responsesToDo: 3,
    isLoading: false
  });
  
  const [newDemandTitle, setNewDemandTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Clear loading state on unmount or when department changes
  useEffect(() => {
    return () => setIsLoading(false);
  }, [departmentId]);
  
  // Load dashboard configuration for the specified department and view type
  const loadDashboardConfig = useCallback(async () => {
    console.log(`Loading dashboard config for department: ${departmentId}, view type: ${viewType}`);
    setIsLoading(true);
    
    try {
      // First try to get department-specific config
      const { data: departmentConfig, error: departmentError } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', departmentId)
        .eq('view_type', viewType)
        .maybeSingle();
        
      if (departmentError && departmentError.code !== 'PGRST116') {
        console.error('Error fetching department dashboard config:', departmentError);
      }
      
      // If we found department-specific config, use it
      if (departmentConfig && departmentConfig.cards_config) {
        try {
          const parsedCards = JSON.parse(departmentConfig.cards_config);
          console.log(`Loaded ${parsedCards.length} cards from department-specific config`);
          setCards(parsedCards);
          setConfigSource('custom');
          return;
        } catch (parseError) {
          console.error('Error parsing department dashboard config:', parseError);
        }
      }
      
      // If no department-specific config or error, fall back to default
      console.log('No department-specific config found, falling back to default');
      const { data: defaultConfig, error: defaultError } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', 'default')
        .eq('view_type', viewType)
        .maybeSingle();
        
      if (defaultError) {
        console.error('Error fetching default dashboard config:', defaultError);
      }
      
      // If we found default config, use it
      if (defaultConfig && defaultConfig.cards_config) {
        try {
          const parsedCards = JSON.parse(defaultConfig.cards_config);
          console.log(`Loaded ${parsedCards.length} cards from default config`);
          setCards(parsedCards);
          setConfigSource('default');
        } catch (parseError) {
          console.error('Error parsing default dashboard config:', parseError);
          setCards([]);
        }
      } else {
        // If no default config, set empty cards
        console.log('No default config found, setting empty cards array');
        setCards([]);
      }
    } catch (error) {
      console.error('Error loading dashboard config:', error);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [departmentId, viewType]);
  
  // Load dashboard config when component mounts or department changes
  useEffect(() => {
    loadDashboardConfig();
  }, [loadDashboardConfig]);
  
  // Handle editing a card
  const handleEditCard = useCallback((card: ActionCardItem) => {
    setEditingCard(card);
    setIsCustomizationModalOpen(true);
  }, []);
  
  // Handle deleting a card
  const handleDeleteCard = useCallback((id: string) => {
    console.log(`Deleting card with ID: ${id}`);
    setCards(prevCards => {
      const newCards = prevCards.filter(card => card.id !== id);
      console.log(`Cards after deletion: ${newCards.length}`);
      return newCards;
    });
    
    toast({
      title: "Card removido",
      description: "O card foi removido com sucesso"
    });
  }, []);
  
  // Handle hiding a card
  const handleHideCard = useCallback((id: string) => {
    console.log(`Hiding card with ID: ${id}`);
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id 
          ? { ...card, isHidden: true } 
          : card
      )
    );
    
    toast({
      title: "Card ocultado",
      description: "O card foi ocultado da visualização"
    });
  }, []);
  
  // Handle saving a card
  const handleSaveCard = useCallback((data: any) => {
    if (editingCard) {
      // Update existing card
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === editingCard.id 
            ? { ...card, ...data } 
            : card
        )
      );
      
      toast({
        title: "Card atualizado",
        description: "O card foi atualizado com sucesso"
      });
    } else {
      // Create new card
      const newCard = {
        ...data,
        id: `card-${uuidv4()}`,
        isCustom: true
      };
      
      setCards(prevCards => [...prevCards, newCard]);
      
      toast({
        title: "Card criado",
        description: "O novo card foi criado com sucesso"
      });
    }
    
    setEditingCard(null);
    setIsCustomizationModalOpen(false);
  }, [editingCard]);
  
  // Handle quick demand submit
  const handleQuickDemandSubmit = useCallback(() => {
    console.log(`Creating quick demand with title: ${newDemandTitle}`);
    setNewDemandTitle('');
    
    toast({
      title: "Demanda rápida criada",
      description: "Sua demanda foi criada com sucesso"
    });
  }, [newDemandTitle]);
  
  // Handle search submit
  const handleSearchSubmit = useCallback((query: string) => {
    console.log(`Searching for: ${query}`);
    setSearchQuery('');
    
    toast({
      title: "Busca iniciada",
      description: `Buscando por "${query}"`
    });
  }, []);
  
  return {
    cards,
    setCards,
    isLoading,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    specialCardsData,
    newDemandTitle,
    setNewDemandTitle,
    searchQuery,
    setSearchQuery,
    handleEditCard,
    handleDeleteCard,
    handleHideCard,
    handleSaveCard,
    handleQuickDemandSubmit,
    handleSearchSubmit,
    configSource,
    viewType,
    departmentId
  };
};

export default useDefaultDashboardState;
