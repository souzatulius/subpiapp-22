import React, { useState, useEffect } from 'react';
import { PlusCircle, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { UnifiedActionCard } from '@/components/dashboard/UnifiedActionCard';
import { ActionCardItem, CardColor } from '@/types/dashboard';
import { useDefaultDashboardConfig } from '@/hooks/dashboard/useDefaultDashboardConfig';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface ActionCardsProps {
  coordenacaoId: string;
  isComunicacao: boolean;
  baseUrl?: string;
  isEditMode?: boolean;
  onEdit?: (card: ActionCardItem) => void;
}

const ActionCards: React.FC<ActionCardsProps> = ({ 
  coordenacaoId, 
  isComunicacao,
  baseUrl = '',
  isEditMode = false,
  onEdit
}) => {
  const { config: dashboardCards, isLoading, setConfig } = useDefaultDashboardConfig('comunicacao');
  const { user } = useAuth();
  
  const defaultCards: ActionCardItem[] = [
    {
      id: 'cadastrar-demanda',
      title: 'Cadastrar Demanda',
      subtitle: 'Registre novas solicitações da imprensa',
      iconId: 'PlusCircle',
      path: `${baseUrl ? `/${baseUrl}` : ''}/cadastrar',
      color: 'blue-vivid' as CardColor,
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: 'responder-demanda',
      title: 'Responder Demanda',
      subtitle: 'Responda às demandas pendentes',
      iconId: 'MessageSquare',
      path: `${baseUrl ? `/${baseUrl}` : ''}/responder',
      color: 'green-neon' as CardColor,
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: 'criar-nota',
      title: 'Criar Nota Oficial',
      subtitle: 'Elabore notas oficiais',
      iconId: 'FileText',
      path: `${baseUrl ? `/${baseUrl}` : ''}/criar-nota',
      color: 'orange-dark' as CardColor,
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: 'aprovar-nota',
      title: 'Aprovar Notas',
      subtitle: 'Revise e aprove notas oficiais',
      iconId: 'CheckCircle',
      path: `${baseUrl ? `/${baseUrl}` : ''}/aprovar-nota',
      color: 'yellow' as CardColor,
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    }
  ];

  const [cards, setCards] = useState<ActionCardItem[]>(
    (dashboardCards && dashboardCards.length > 0) ? dashboardCards : defaultCards
  );

  useEffect(() => {
    if (dashboardCards && dashboardCards.length > 0) {
      setCards(dashboardCards);
    } else {
      setCards(defaultCards);
    }
  }, [dashboardCards]);

  const handleCardEdit = (cardId: string) => {
    const cardToEdit = cards.find(c => c.id === cardId);
    if (cardToEdit && onEdit) onEdit(cardToEdit);
  };

  const handleCardHide = async (cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    if (user) {
      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
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
              department_id: coordenacaoId
            });
        }
        
        setConfig(updatedCards);
        
        toast({
          title: "Card ocultado",
          description: "O card foi ocultado do painel. Você pode restaurá-lo nas configurações.",
          variant: "default",
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-[160px] animate-pulse bg-gray-100">
            <CardContent className="p-4 flex items-center justify-center">
              <div className="text-gray-400">Carregando...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.filter(card => !card.isHidden).map((card, index) => (
        <div key={card.id || index} className="h-[160px]">
          {isEditMode ? (
            <UnifiedActionCard
              id={card.id}
              title={card.title}
              subtitle={card.subtitle}
              iconId={card.iconId}
              path={card.path}
              color={card.color}
              width={card.width || '25'}
              height={'1'}
              type={card.type || 'standard'} 
              onEdit={handleCardEdit}
              onHide={handleCardHide}
              isEditing={isEditMode}
              hasSubtitle={!!card.subtitle}
              iconSize="md"
            />
          ) : (
            <Link to={card.path} className="block h-full">
              <UnifiedActionCard
                id={card.id}
                title={card.title}
                subtitle={card.subtitle}
                iconId={card.iconId}
                path={card.path}
                color={card.color}
                width={card.width || '25'}
                height={'1'}
                type={card.type || 'standard'} 
                onEdit={handleCardEdit}
                onHide={handleCardHide}
                hasSubtitle={!!card.subtitle}
                iconSize="md"
              />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default ActionCards;
