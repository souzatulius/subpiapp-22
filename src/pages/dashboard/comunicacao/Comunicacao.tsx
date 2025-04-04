
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { MessageSquareReply, Loader2, PlusCircle, List, MessageCircle, FileText, CheckCircle, Trophy, BarChart2, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useUserData } from '@/hooks/dashboard/useUserData';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem, CardColor } from '@/types/dashboard';
import { useBadgeValues } from '@/hooks/dashboard/useBadgeValues';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import EditCardModal from '@/components/dashboard/card-customization/EditCardModal';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ 
  isPreview = false, 
  department = 'comunicacao' 
}) => {
  const { user } = useAuth();
  const { firstName } = useUserData(user?.id);
  const isMobile = useIsMobile();
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const { getBadgeValue } = useBadgeValues();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);

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

  useEffect(() => {
    if (!user || isPreview) return;

    const getUserDepartment = async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('coordenacao_id')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user department:', error);
        return;
      }
      
      setUserDepartment(data?.coordenacao_id || null);
    };

    getUserDepartment();
  }, [user, isPreview]);

  useEffect(() => {
    const initialCards: ActionCardItem[] = [
      {
        id: 'comunicacao',
        title: "Comunicação",
        path: "/dashboard/comunicacao",
        iconId: "message-square-reply",
        color: getBgColor('blue-700'),
        width: "50",
        height: "1", // Changed from "2" to "1"
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
        height: "1", // Changed from "2" to "1"
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
        height: "1", // Changed from "2" to "1"
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
        height: "1", // Changed from "2" to "1"
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
        height: "1", // Changed from "2" to "1"
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
        height: "1", // Changed from "2" to "1"
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
        height: "1", // Changed from "2" to "1"
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
        height: "1", // Changed from "2" to "1"
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
        height: "1", // Changed from "2" to "1"
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
  }, [userDepartment, getBadgeValue]);

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
    
    // Update card in local state
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? { ...card, ...updatedCard } : card
    );
    
    setCards(updatedCards);
    setIsEditModalOpen(false);
    setSelectedCard(null);
    
    // Save to database if user is logged in
    if (user) {
      try {
        // Get current cards config
        const { data } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();
          
        if (data) {
          // Update existing config
          await supabase
            .from('user_dashboard')
            .update({ 
              cards_config: JSON.stringify(updatedCards),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        } else {
          // Create new config
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

  if (!isPreview && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <span className="text-blue-600 font-medium text-lg">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* WelcomeCard takes full width */}
      <div className="w-full">
        <WelcomeCard
          title="Comunicação"
          description="Gerencie demandas e notas oficiais"
          icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />
      </div>
      
      {/* Personalize button now appears below the WelcomeCard as an icon only */}
      <div className="flex justify-end">
        <Button 
          onClick={toggleEditMode}
          variant={isEditMode ? "default" : "ghost"}
          size="icon"
          className={`${
            isEditMode 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title={isEditMode ? 'Concluir edição' : 'Personalizar dashboard'}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      <div>
        <UnifiedCardGrid
          cards={cards}
          onCardsChange={(updatedCards) => setCards(updatedCards)}
          onEditCard={handleCardEdit}
          onHideCard={handleCardHide}
          isMobileView={isMobile}
          isEditMode={isEditMode}
          specialCardsData={{}}
        />
      </div>
      
      {/* Card Edit Modal */}
      <EditCardModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCardEdit}
        card={selectedCard}
      />
      
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
