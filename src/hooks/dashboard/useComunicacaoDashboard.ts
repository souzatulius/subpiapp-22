import { useState, useEffect } from 'react';
import { ActionCardItem, CardColor } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useBadgeValues } from '@/hooks/dashboard/useBadgeValues';

export const useComunicacaoDashboard = (
  user: any,
  isPreview: boolean = false,
  defaultDepartment: string = 'comunicacao'
) => {
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getBadgeValue } = useBadgeValues();

  const getBgColor = (color: string): CardColor => {
    switch (color) {
      case 'grey-400': return 'gray-400' as CardColor;
      case 'grey-800': return 'gray-800' as CardColor;
      case 'grey-950': return 'gray-950' as CardColor;
      case 'blue-700': return 'blue-700' as CardColor;
      case 'blue-960': return 'blue-900' as CardColor;
      case 'orange-400': return 'orange-400' as CardColor;
      case 'orange-500': return 'orange-500' as CardColor;
      case 'neutral-200': return 'gray-200' as CardColor;
      case 'lime-500': return 'lime-500' as CardColor;
      default: return 'blue-700' as CardColor;
    }
  };

  // Fetch user department
  useEffect(() => {
    setIsLoading(true);
    if (!user || isPreview) {
      if (isPreview) {
        setUserDepartment(defaultDepartment);
      }
      setIsLoading(false);
      return;
    }

    const getUserDepartment = async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('coordenacao_id')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user department:', error);
        setIsLoading(false);
        return;
      }
      
      setUserDepartment(data?.coordenacao_id || null);
      setIsLoading(false);
    };

    getUserDepartment();
  }, [user, isPreview, defaultDepartment]);

  // Initialize cards
  useEffect(() => {
    if (isLoading) return; // Não carregue cards se ainda estiver carregando o departamento
    
    setIsLoading(true);
    
    const initialCards: ActionCardItem[] = [
      {
        id: 'comunicacao',
        title: "Comunicação",
        path: "/dashboard/comunicacao",
        iconId: "message-square-reply",
        color: getBgColor('blue-700'),
        width: "25",
        height: "1",
        type: "standard",
        displayMobile: true,
        mobileOrder: 1
      },
      {
        id: 'nova-solicitacao',
        title: "Nova Solicitação",
        path: "/dashboard/comunicacao/cadastrar",
        iconId: "plus-circle",
        color: getBgColor('orange-400'),
        width: "25",
        height: "1",
        type: "standard",
        displayMobile: true,
        mobileOrder: 2,
        allowedDepartments: ['comunicacao']
      },
      {
        id: 'consultar-demandas',
        title: "Consultar Demandas",
        path: "/dashboard/comunicacao/demandas",
        iconId: "list-filter",
        color: getBgColor('grey-800'),
        width: "25",
        height: "1",
        type: "standard",
        displayMobile: true,
        mobileOrder: 3
      },
      {
        id: 'responder-demandas',
        title: "Responder Demandas",
        path: "/dashboard/comunicacao/responder",
        iconId: "message-circle",
        color: getBgColor('orange-500'),
        width: "25",
        height: "1",
        type: "standard",
        hasBadge: true,
        badgeValue: getBadgeValue('responder-demandas'),
        displayMobile: true,
        mobileOrder: 4
      },
      {
        id: 'criar-nota',
        title: "Criar Nota",
        path: "/dashboard/comunicacao/criar-nota",
        iconId: "file-text",
        color: getBgColor('blue-960'),
        width: "25",
        height: "1",
        type: "standard",
        hasBadge: true,
        badgeValue: getBadgeValue('criar-nota'),
        displayMobile: true,
        mobileOrder: 5,
        allowedDepartments: ['comunicacao']
      },
      {
        id: 'consultar-notas',
        title: "Consultar Notas",
        path: "/dashboard/comunicacao/notas",
        iconId: "file-text",
        color: getBgColor('neutral-200'),
        width: "25",
        height: "1",
        type: "standard",
        displayMobile: true,
        mobileOrder: 6
      },
      {
        id: 'aprovar-notas',
        title: "Aprovar Notas",
        path: "/dashboard/comunicacao/aprovar-nota",
        iconId: "check-circle",
        color: getBgColor('grey-950'),
        width: "25",
        height: "1",
        type: "standard",
        hasBadge: true,
        badgeValue: getBadgeValue('aprovar-notas'),
        displayMobile: true,
        mobileOrder: 7
      },
      {
        id: 'ranking-zeladoria',
        title: "Ranking da Zeladoria",
        path: "/dashboard/zeladoria/ranking-subs",
        iconId: "trophy",
        color: getBgColor('lime-500'),
        width: "25",
        height: "1",
        type: "standard",
        displayMobile: true,
        mobileOrder: 8
      },
      {
        id: 'relatorios-comunicacao',
        title: "Relatórios da Comunicação",
        path: "/dashboard/comunicacao/relatorios",
        iconId: "bar-chart-2",
        color: getBgColor('grey-400'),
        width: "25",
        height: "1",
        type: "standard",
        displayMobile: true,
        mobileOrder: 9,
        allowedDepartments: ['comunicacao', 'gabinete']
      }
    ];

    const filteredCards = initialCards.filter(card => {
      if (card.allowedDepartments && card.allowedDepartments.length > 0) {
        return !userDepartment || card.allowedDepartments.includes(userDepartment);
      }
      return true;
    });

    setCards(filteredCards);
    setIsLoading(false);
  }, [userDepartment, getBadgeValue, isLoading]);

  const handleCardEdit = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleCardHide = (id: string) => {
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    if (user) {
      try {
        const saveCardConfig = async () => {
          const { data, error } = await supabase
            .from('user_dashboard')
            .select('cards_config')
            .eq('user_id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') throw error;
          
          if (data) {
            await supabase
              .from('user_dashboard')
              .update({ 
                cards_config: JSON.stringify(updatedCards),
                updated_at: new Date().toISOString()
              })
              .eq('user_id', user.id);
          } else {
            await supabase
              .from('user_dashboard')
              .insert({ 
                user_id: user.id,
                cards_config: JSON.stringify(updatedCards),
                department_id: userDepartment || null
              });
          }
          
          toast({
            title: "Card ocultado",
            description: "O card foi ocultado do painel. Você pode restaurá-lo nas configurações.",
            variant: "default",
          });
        };
        
        saveCardConfig();
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

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSaveCardEdit = async (updatedCard: Partial<ActionCardItem>) => {
    if (!updatedCard.id) return;
    
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? { ...card, ...updatedCard } : card
    );
    
    setCards(updatedCards);
    setIsEditModalOpen(false);
    setSelectedCard(null);
    
    if (user) {
      try {
        const { data } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();
          
        if (data) {
          await supabase
            .from('user_dashboard')
            .update({ 
              cards_config: JSON.stringify(updatedCards),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('user_dashboard')
            .insert({ 
              user_id: user.id,
              cards_config: JSON.stringify(updatedCards),
              department_id: userDepartment || null
            });
        }
        
        toast({
          title: "Card atualizado",
          description: "As alterações foram salvas com sucesso.",
          variant: "default",
        });
      } catch (error) {
        console.error('Erro ao salvar alterações do card:', error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar as alterações. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  return {
    cards,
    isEditMode,
    isEditModalOpen,
    selectedCard,
    userDepartment,
    isLoading,
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen
  };
};
