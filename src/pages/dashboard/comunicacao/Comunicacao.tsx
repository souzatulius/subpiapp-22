
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { MessageSquareReply, Loader2, PlusCircle, List, MessageCircle, FileText, CheckCircle, Trophy, BarChart2, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useUserData } from '@/hooks/dashboard/useUserData';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem, CardColor, DynamicCardItem } from '@/types/dashboard';
import { useBadgeValues } from '@/hooks/dashboard/useBadgeValues';
import { supabase } from '@/integrations/supabase/client';
import { useDynamicCardsData } from '@/hooks/dashboard/useDynamicCardsData';

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
  const [dynamicCards, setDynamicCards] = useState<DynamicCardItem[]>([]);
  const { getBadgeValue } = useBadgeValues();
  const dynamicData = useDynamicCardsData(department);

  // Function to convert color string to CardColor enum
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

  // Setup initial action cards
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

    // Setup initial dynamic cards based on requirements
    const initialDynamicCards: DynamicCardItem[] = [
      {
        id: 'smart-search',
        title: "O que vamos fazer?",
        type: "dynamic",
        iconId: "search",
        path: "",
        color: getBgColor('blue-light'),
        width: "100", // will occupy full width
        height: "1",
        dataSourceKey: "smartSearch",
        displayMobile: true,
        mobileOrder: 0,
        allowedDepartments: [],
        canEdit: false,
        widthDesktop: 4,
        widthMobile: 2
      },
      {
        id: 'kpi-solicitacoes',
        title: "Solicitações de Imprensa",
        type: "dynamic",
        iconId: "message-square-reply",
        path: "",
        color: getBgColor('blue'),
        width: "25",
        height: "1",
        dataSourceKey: "kpi_solicitacoes",
        displayMobile: true,
        mobileOrder: 10,
        allowedDepartments: ['comunicacao', 'gabinete'],
        canEdit: false,
        widthDesktop: 1,
        widthMobile: 1
      },
      {
        id: 'kpi-demandas-aprovacao',
        title: "Demandas em Aprovação",
        type: "dynamic",
        iconId: "clipboard-document-check",
        path: "",
        color: getBgColor('orange'),
        width: "25",
        height: "1",
        dataSourceKey: "kpi_demandas_aprovacao",
        displayMobile: true,
        mobileOrder: 11,
        allowedDepartments: ['comunicacao', 'gabinete'],
        canEdit: false,
        widthDesktop: 1,
        widthMobile: 1
      },
      {
        id: 'kpi-notas-produzidas',
        title: "Notas Produzidas",
        type: "dynamic",
        iconId: "file-text",
        path: "",
        color: getBgColor('green'),
        width: "25",
        height: "1",
        dataSourceKey: "kpi_notas_produzidas",
        displayMobile: true,
        mobileOrder: 12,
        allowedDepartments: ['comunicacao', 'gabinete'],
        canEdit: false,
        widthDesktop: 1,
        widthMobile: 1
      },
      {
        id: 'demandas-andamento',
        title: "Demandas em Andamento",
        type: "dynamic",
        iconId: "list-bullet",
        path: "",
        color: getBgColor('blue-dark'),
        width: "50",
        height: "2",
        dataSourceKey: "demandas_andamento",
        displayMobile: true,
        mobileOrder: 13,
        allowedDepartments: ['comunicacao'],
        canEdit: false,
        widthDesktop: 2,
        widthMobile: 2
      },
      {
        id: 'demandas-aguardando-resposta',
        title: "Aguardando Resposta",
        type: "dynamic",
        iconId: "inbox-arrow-down",
        path: "",
        color: getBgColor('orange-light'),
        width: "50",
        height: "2",
        dataSourceKey: "demandas_aguardando_resposta",
        displayMobile: true,
        mobileOrder: 14,
        allowedDepartments: [],
        canEdit: false,
        widthDesktop: 2,
        widthMobile: 1
      },
      {
        id: 'notas-aprovacao',
        title: "Notas para Aprovação",
        type: "dynamic",
        iconId: "check-circle",
        path: "",
        color: getBgColor('green-light'),
        width: "50",
        height: "2",
        dataSourceKey: "notas_aprovacao",
        displayMobile: true,
        mobileOrder: 15,
        allowedDepartments: [],
        canEdit: false,
        widthDesktop: 2,
        widthMobile: 1
      },
      {
        id: 'demandas-aguardando-nota',
        title: "Demandas Aguardando Nota",
        type: "dynamic",
        iconId: "file-text",
        path: "",
        color: getBgColor('blue-light'),
        width: "50",
        height: "2",
        dataSourceKey: "demandas_aguardando_nota",
        displayMobile: true,
        mobileOrder: 16,
        allowedDepartments: ['comunicacao'],
        canEdit: false,
        widthDesktop: 2,
        widthMobile: 1
      },
      {
        id: 'form-origem',
        title: "Nova Solicitação",
        type: "dynamic",
        iconId: "plus-circle",
        path: "",
        color: getBgColor('orange-light'),
        width: "50",
        height: "2",
        dataSourceKey: "form_origem",
        displayMobile: true,
        mobileOrder: 17,
        allowedDepartments: ['comunicacao'],
        canEdit: false,
        widthDesktop: 2,
        widthMobile: 1
      }
    ];

    // Filter cards based on user department
    const filteredCards = initialCards.filter(card => {
      if (card.allowedDepartments && card.allowedDepartments.length > 0) {
        return !userDepartment || card.allowedDepartments.includes(userDepartment);
      }
      return true;
    });

    const filteredDynamicCards = initialDynamicCards.filter(card => {
      if (card.allowedDepartments && card.allowedDepartments.length > 0) {
        return !userDepartment || card.allowedDepartments.includes(userDepartment);
      }
      return true;
    });

    setCards(filteredCards);
    setDynamicCards(filteredDynamicCards);
  }, [userDepartment, getBadgeValue]);

  // Combine standard and dynamic cards
  const allCards = [...cards, ...dynamicCards];

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
      <div>
        <WelcomeCard
          title="Comunicação"
          description="Gerencie demandas e notas oficiais"
          icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />
      </div>
      
      <div className="mt-4">
        <UnifiedCardGrid
          cards={allCards}
          onCardsChange={(updatedCards) => {
            // Split updated cards back into standard and dynamic cards
            const standardCards = updatedCards.filter(card => card.type !== 'dynamic');
            const dynamicCards = updatedCards.filter(card => card.type === 'dynamic');
            
            setCards(standardCards);
            setDynamicCards(dynamicCards as DynamicCardItem[]);
          }}
          isMobileView={isMobile}
          specialCardsData={dynamicData}
        />
      </div>
      
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
