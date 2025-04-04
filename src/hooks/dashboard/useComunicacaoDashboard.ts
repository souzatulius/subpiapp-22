
import { useState, useEffect, useCallback } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useComunicacaoDashboard = (
  user: User | null,
  isPreview: boolean = false,
  department: string = 'comunicacao'
) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);

  const fetchDashboardCards = useCallback(async () => {
    if (!user && !isPreview) {
      setCards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      let data;
      
      // For preview mode or when user is not authenticated
      if (isPreview || !user) {
        // Fetch department default cards
        const { data: deptData, error: deptError } = await supabase
          .from('department_dashboards')
          .select('cards_config')
          .eq('department', department)
          .eq('view_type', 'communication')
          .maybeSingle();
          
        if (deptError && deptError.code !== 'PGRST116') {
          console.error('Error fetching department dashboard:', deptError);
        } else if (deptData?.cards_config) {
          data = deptData;
        }
      } else {
        // Fetch user's personalized cards
        const { data: userData, error: userError } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .eq('page', 'comunicacao')
          .maybeSingle();
          
        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user dashboard:', userError);
        } else if (userData?.cards_config) {
          data = userData;
        } else {
          // If no user configuration, try to get department default
          const { data: deptData, error: deptError } = await supabase
            .from('department_dashboards')
            .select('cards_config')
            .eq('department', department)
            .eq('view_type', 'communication')
            .maybeSingle();
            
          if (deptError && deptError.code !== 'PGRST116') {
            console.error('Error fetching department dashboard:', deptError);
          } else if (deptData?.cards_config) {
            data = deptData;
          }
        }
      }
      
      // Process the data
      if (data?.cards_config) {
        try {
          // Parse cards config
          const parsedCards = typeof data.cards_config === 'string'
            ? JSON.parse(data.cards_config) as ActionCardItem[]
            : data.cards_config as ActionCardItem[];
            
          if (Array.isArray(parsedCards)) {
            setCards(parsedCards);
          } else {
            setCards([]);
          }
        } catch (error) {
          console.error('Error parsing cards config:', error);
          setCards([]);
        }
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error('Unexpected error fetching dashboard config:', error);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, department, isPreview]);

  useEffect(() => {
    fetchDashboardCards();
  }, [fetchDashboardCards]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCardEdit = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleSaveCardEdit = async (updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    
    setCards(updatedCards);
    
    if (user) {
      await saveCardsConfig(updatedCards);
    }
    
    setIsEditModalOpen(false);
  };

  const handleCardHide = async (id: string) => {
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    if (user) {
      await saveCardsConfig(updatedCards);
      
      toast({
        title: "Card ocultado",
        description: "O card foi ocultado do dashboard.",
        variant: "default",
      });
    }
  };
  
  const handleCardsReorder = async (reorderedCards: ActionCardItem[]) => {
    setCards(reorderedCards);
    
    if (user) {
      await saveCardsConfig(reorderedCards);
    }
  };

  const saveCardsConfig = async (cardsToSave: ActionCardItem[]) => {
    if (!user) return;
    
    try {
      const { data: existingConfig, error: checkError } = await supabase
        .from('user_dashboard')
        .select('id')
        .eq('user_id', user.id)
        .eq('page', 'comunicacao')
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing config:', checkError);
        return;
      }
      
      const cardsJson = JSON.stringify(cardsToSave);
      
      if (existingConfig) {
        // Update existing config
        const { error: updateError } = await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: cardsJson,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id);
          
        if (updateError) {
          console.error('Error updating dashboard config:', updateError);
          toast({
            title: "Erro ao salvar",
            description: "Não foi possível salvar as alterações.",
            variant: "destructive",
          });
        }
      } else {
        // Insert new config
        const { error: insertError } = await supabase
          .from('user_dashboard')
          .insert({
            user_id: user.id,
            page: 'comunicacao',
            cards_config: cardsJson,
            department_id: department
          });
          
        if (insertError) {
          console.error('Error inserting dashboard config:', insertError);
          toast({
            title: "Erro ao salvar",
            description: "Não foi possível salvar as alterações.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error saving dashboard config:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado ao salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  return {
    cards,
    isEditMode,
    isEditModalOpen,
    selectedCard,
    isLoading,
    handleCardEdit,
    handleCardHide,
    handleCardsReorder,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen
  };
};
