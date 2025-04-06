
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { getDefaultCards } from './defaultCards';
import { toast } from '@/hooks/use-toast';

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load cards from Supabase or default configuration
  useEffect(() => {
    const fetchUserCards = async () => {
      setIsLoading(true);
      
      if (!user) {
        const defaultCards = getDefaultCards();
        setCards(defaultCards);
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching user dashboard config for user ID:', user.id);
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.log('Error fetching user dashboard or no config found:', error);
          // Fallback to default cards
          const defaultCards = getDefaultCards();
          setCards(defaultCards);
        } else if (data && data.cards_config) {
          console.log('User dashboard config found:', data);
          // Parse JSON if needed
          try {
            const userCards = typeof data.cards_config === 'string' 
              ? JSON.parse(data.cards_config) 
              : data.cards_config;
              
            setCards(userCards);
            console.log('Loaded user cards:', userCards);
          } catch (parseError) {
            console.error('Error parsing cards config JSON:', parseError);
            const defaultCards = getDefaultCards();
            setCards(defaultCards);
          }
        } else {
          console.log('No user dashboard config found, using defaults');
          const defaultCards = getDefaultCards();
          setCards(defaultCards);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard config:', err);
        const defaultCards = getDefaultCards();
        setCards(defaultCards);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserCards();
  }, [user]);

  // Handle card reordering and save to Supabase
  const handleCardsReorder = async (updatedCards: ActionCardItem[]) => {
    setCards(updatedCards);
    
    if (user) {
      try {
        console.log('Saving reordered cards to Supabase');
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (error || !data) {
          // Create new record
          console.log('Creating new user dashboard record');
          const { error: insertError } = await supabase
            .from('user_dashboard')
            .insert({ 
              user_id: user.id,
              cards_config: JSON.stringify(updatedCards),
              department_id: 'default'
            });
            
          if (insertError) {
            console.error('Error inserting new dashboard config:', insertError);
            toast({
              title: "Erro ao salvar dashboard",
              description: "Não foi possível salvar a personalização do dashboard",
              variant: "destructive"
            });
          } else {
            console.log('Dashboard configuration saved successfully');
          }
        } else {
          // Update existing record
          console.log('Updating existing user dashboard record');
          const { error: updateError } = await supabase
            .from('user_dashboard')
            .update({ 
              cards_config: JSON.stringify(updatedCards),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
            
          if (updateError) {
            console.error('Error updating dashboard config:', updateError);
            toast({
              title: "Erro ao salvar dashboard",
              description: "Não foi possível salvar a personalização do dashboard",
              variant: "destructive"
            });
          } else {
            console.log('Dashboard configuration updated successfully');
          }
        }
      } catch (error) {
        console.error('Error saving card order:', error);
        toast({
          title: "Erro ao salvar configuração",
          description: "Não foi possível persistir as alterações",
          variant: "destructive"
        });
      }
    }
  };

  // Handle card edit - receives a card with updated properties
  const handleCardEdit = async (updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? { ...card, ...updatedCard } : card
    );
    
    setCards(updatedCards);
    
    // Save to database if user is logged in
    if (user) {
      try {
        console.log('Saving card edit to Supabase');
        const { error } = await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(updatedCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error saving card updates:', error);
          toast({
            title: "Erro ao salvar alterações",
            description: "Não foi possível salvar as alterações do card",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Card atualizado",
            description: "As alterações foram salvas com sucesso",
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Error saving card updates:', error);
        toast({
          title: "Erro ao salvar alterações",
          description: "Não foi possível persistir as alterações",
          variant: "destructive"
        });
      }
    }
  };

  // Handle card hide - marks a card as hidden
  const handleCardHide = async (cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    // Save to database if user is logged in
    if (user) {
      try {
        console.log('Saving card visibility change to Supabase');
        const { error } = await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(updatedCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error saving card visibility:', error);
          toast({
            title: "Erro ao ocultar card",
            description: "Não foi possível salvar a alteração de visibilidade",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Card ocultado",
            description: "O card foi ocultado com sucesso",
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Error saving card visibility:', error);
        toast({
          title: "Erro ao ocultar card",
          description: "Não foi possível salvar a alteração de visibilidade",
          variant: "destructive"
        });
      }
    }
  };

  // Reset dashboard to default configuration
  const resetDashboard = async () => {
    const defaultCards = getDefaultCards();
    setCards(defaultCards);
    
    // Save to database if user is logged in
    if (user) {
      try {
        console.log('Resetting dashboard to defaults in Supabase');
        const { error } = await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(defaultCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error resetting dashboard:', error);
          toast({
            title: "Erro ao resetar dashboard",
            description: "Não foi possível restaurar a configuração padrão",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Dashboard resetado",
            description: "A configuração padrão foi restaurada com sucesso",
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Error resetting dashboard:', error);
        toast({
          title: "Erro ao resetar dashboard",
          description: "Não foi possível restaurar a configuração padrão",
          variant: "destructive"
        });
      }
    }
  };

  return {
    cards,
    isLoading,
    handleCardEdit,
    handleCardHide,
    handleCardsReorder,
    resetDashboard
  };
};
