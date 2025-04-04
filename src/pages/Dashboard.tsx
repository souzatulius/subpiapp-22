import React, { useState, useCallback, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/hooks/useSupabaseAuth';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Home, MessageSquareReply, PlusCircle, List, MessageCircle, FileText, CheckCircle, Trophy, BarChart2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { Loader2 } from 'lucide-react';
import { useUserData } from '@/hooks/dashboard/useUserData';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem, CardColor } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { useBadgeValues } from '@/hooks/dashboard/useBadgeValues';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { firstName } = useUserData(user?.id);
  const [isLoading, setIsLoading] = useState(true);
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const { getBadgeValue } = useBadgeValues();
  const [isEditMode, setIsEditMode] = useState(false);

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

  const getUserDepartment = useCallback(async () => {
    if (!user) return;
    
    try {
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
      setIsLoading(false);
    } catch (e) {
      console.error('Error in getUserDepartment:', e);
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    getUserDepartment();
  }, [user, getUserDepartment]);

  useEffect(() => {
    const initialCards: ActionCardItem[] = [
      {
        id: 'comunicacao',
        title: "Comunicação",
        path: "/dashboard/comunicacao",
        iconId: "message-square-reply",
        color: getBgColor('blue-700'),
        width: "50",
        height: "2",
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
        height: "2",
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
        height: "2",
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
        height: "2",
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
        height: "2",
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
        height: "2",
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
        height: "2",
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
        height: "2",
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
        height: "2",
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
    toast({
      title: "Edição de Card",
      description: "Função de edição será implementada em breve.",
      variant: "default",
    });
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <span className="text-blue-600 font-medium text-lg">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto">
          <BreadcrumbBar />
          <div className="max-w-7xl mx-auto p-6 pb-20 md:pb-6">
            <div className="flex justify-between items-center mb-4">
              <WelcomeCard
                title="Dashboard"
                description="Bem-vindo ao seu dashboard personalizado."
                icon={<Home className="h-6 w-6 mr-2" />}
                color="bg-gradient-to-r from-blue-800 to-blue-950"
                userName={firstName}
              />
              
              <button 
                onClick={toggleEditMode}
                className={`hidden md:flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                  isEditMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isEditMode ? 'Concluir edição' : 'Personalizar dashboard'}
              </button>
            </div>
            
            <div className="mt-6">
              <UnifiedCardGrid
                cards={cards.filter(card => !card.isHidden)}
                onCardsChange={(updatedCards) => setCards(updatedCards)}
                onEditCard={handleCardEdit}
                onHideCard={handleCardHide}
                isMobileView={isMobile}
                isEditMode={isEditMode}
                specialCardsData={{}}
              />
            </div>
          </div>
        </main>
      </div>
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Dashboard;
