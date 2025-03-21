
import { useState, useEffect } from 'react';
import { ClipboardList, MessageSquareReply, FileCheck, BarChart2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ActionCardItem } from '@/components/dashboard/CardGrid';

export const useDashboardState = (userId?: string) => {
  const [firstName, setFirstName] = useState('');
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([
    {
      id: '1',
      title: 'Nova Demanda',
      icon: <ClipboardList className="h-12 w-12" />,
      path: '/dashboard/comunicacao/cadastrar',
      color: 'blue',
      width: '25',
      height: '1'
    },
    {
      id: '2',
      title: 'Responder Demandas',
      icon: <MessageSquareReply className="h-12 w-12" />,
      path: '/dashboard/comunicacao/responder',
      color: 'green',
      width: '25',
      height: '1'
    },
    {
      id: '3',
      title: 'Aprovar Nota',
      icon: <FileCheck className="h-12 w-12" />,
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'orange',
      width: '25',
      height: '1'
    },
    {
      id: '4',
      title: 'Números da Comunicação',
      icon: <BarChart2 className="h-12 w-12" />,
      path: '/dashboard/comunicacao/relatorios',
      color: 'purple',
      width: '25',
      height: '1'
    }
  ]);

  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);

  useEffect(() => {
    // Extract the first name from the user's full name
    if (userId) {
      const fetchUserName = async () => {
        try {
          const { data: userData, error } = await supabase
            .from('usuarios')
            .select('nome_completo')
            .eq('id', userId)
            .single();
            
          if (error) throw error;

          // Get the first name only
          const fullName = userData?.nome_completo || '';
          const firstNameOnly = fullName.split(' ')[0];
          setFirstName(firstNameOnly);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserName();
    }
  }, [userId]);

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

  const handleSaveCard = (cardData: Omit<ActionCardItem, 'id'>) => {
    if (editingCard) {
      // Edit existing card
      setActionCards(cards => 
        cards.map(card => 
          card.id === editingCard.id 
            ? { ...card, ...cardData, isCustom: true }
            : card
        )
      );
      
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
    firstName,
    actionCards,
    setActionCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard
  };
};
