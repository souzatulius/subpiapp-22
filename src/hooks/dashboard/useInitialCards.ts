
import { useEffect, useState } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { getBgColor } from './useCardColors';
import { useBadgeValues } from '@/hooks/dashboard/useBadgeValues';

export const useInitialCards = (userDepartment: string | null) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getBadgeValue } = useBadgeValues();

  useEffect(() => {
    setIsLoading(true);
    
    const initialCards: ActionCardItem[] = [
      {
        id: 'comunicacao',
        title: "Notícias e Releases",
        path: "/dashboard/comunicacao",
        iconId: "FileText", 
        color: getBgColor('deep-blue'),
        width: "25",
        height: "0.5",
        type: "standard",
        displayMobile: true,
        mobileOrder: 1
      },
      {
        id: 'nova-solicitacao',
        title: "Nova Solicitação",
        path: "/dashboard/comunicacao/cadastrar", 
        iconId: "Pencil", 
        color: getBgColor('blue-light'),
        width: "25",
        height: "0.5",
        type: "standard",
        displayMobile: true,
        mobileOrder: 2,
        allowedDepartments: ['comunicacao']
      },
      {
        id: 'consultar-demandas',
        title: "Todas as Demandas",
        path: "/dashboard/comunicacao/demandas",
        iconId: "FileText", 
        color: getBgColor('blue-dark'),
        width: "25",
        height: "0.5",
        type: "standard",
        displayMobile: true,
        mobileOrder: 3
      },
      {
        id: 'responder-demandas',
        title: "Responder Demandas",
        path: "/dashboard/comunicacao/responder",
        iconId: "MessageSquare", 
        color: getBgColor('gray-medium'),
        width: "25",
        height: "0.5",
        type: "standard",
        hasBadge: true,
        badgeValue: Number(getBadgeValue('responder-demandas')),
        displayMobile: true,
        mobileOrder: 4
      },
      {
        id: 'criar-nota',
        title: "Criar Nota",
        path: "/dashboard/comunicacao/criar-nota",
        iconId: "FileText",
        color: getBgColor('orange-light'),
        width: "25",
        height: "0.5",
        type: "standard",
        hasBadge: true,
        badgeValue: Number(getBadgeValue('criar-nota')),
        displayMobile: true,
        mobileOrder: 5,
        allowedDepartments: ['comunicacao']
      },
      {
        id: 'consultar-notas',
        title: "Consultar Notas",
        path: "/dashboard/comunicacao/notas",
        iconId: "FileText",
        color: getBgColor('gray-medium'),
        width: "25",
        height: "0.5",
        type: "standard",
        displayMobile: true,
        mobileOrder: 6
      },
      {
        id: 'aprovar-notas',
        title: "Aprovar Notas",
        path: "/dashboard/comunicacao/aprovar-nota",
        iconId: "CheckCircle",
        color: getBgColor('bg-orange-500'),
        width: "25",
        height: "0.5",
        type: "standard",
        hasBadge: true,
        badgeValue: Number(getBadgeValue('aprovar-notas')),
        displayMobile: true,
        mobileOrder: 7
      },
      {
        id: 'ranking-zeladoria',
        title: "Ranking da Zeladoria",
        path: "/dashboard/zeladoria/ranking-subs",
        iconId: "TrendingUp",
        color: getBgColor('orange-800'),
        width: "25",
        height: "0.5",
        type: "standard",
        displayMobile: true,
        mobileOrder: 8
      },
      {
        id: 'relatorios-comunicacao',
        title: "Relatórios da Comunicação",
        path: "/dashboard/comunicacao/relatorios",
        iconId: "PieChart",
        color: getBgColor('orange-light'),
        width: "25",
        height: "0.5",
        type: "standard",
        displayMobile: true,
        mobileOrder: 9,
        allowedDepartments: ['comunicacao', 'gabinete']
      },
      {
        id: 'acoes-pendentes',
        title: "Ações Pendentes",
        path: "/dashboard/comunicacao/responder",
        iconId: "AlertTriangle",
        color: getBgColor('bg-orange-500'),
        width: "25",
        height: "3",
        type: "in_progress_demands",
        isPendingActions: true,
        displayMobile: true,
        mobileOrder: 10
      },
      {
        id: 'esic',
        title: 'Processos e-SIC',
        path: '/dashboard/esic',
        iconId: 'FileSearch',
        color: getBgColor('deep-blue'),
        width: '25',
        height: '0.5',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 11,
        allowedDepartments: ['comunicacao', 'gabinete']
      },
      {
        id: 'notificacoes',
        title: 'Notificações',
        path: '/dashboard/notificacoes',
        iconId: 'Bell',
        color: getBgColor('deep-blue'),
        width: '25',
        height: '0.5',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 12
      },
      {
        id: 'gerar-noticia',
        title: 'Cadastrar Release',
        path: '/dashboard/comunicacao/cadastrar-release',
        iconId: 'Pencil',
        color: getBgColor('gray-medium'),
        width: '25',
        height: '0.5',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 13,
        allowedDepartments: ['comunicacao', 'gabinete']
      },
      {
        id: 'ver-releases',
        title: 'Notícias do Site',
        path: '/dashboard/comunicacao/releases',
        iconId: 'Newspaper',
        color: getBgColor('blue-light'),
        width: '25',
        height: '0.5',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 14
      },
      {
        id: 'perfil-usuario',
        title: 'Perfil do Usuário',
        path: '/dashboard/perfil',
        iconId: 'User',
        color: getBgColor('blue-dark'),
        width: '25',
        height: '0.5',
        type: 'user_profile',
        isUserProfile: true,
        displayMobile: true,
        mobileOrder: 15
      },
      {
        id: 'ajustes-notificacoes',
        title: 'Ajustes de Notificação',
        path: '/dashboard/notificacoes/configuracoes',
        iconId: 'Settings',
        color: getBgColor('blue-dark'),
        width: '25',
        height: '0.5',
        type: 'notification_settings',
        isNotificationSettings: true,
        displayMobile: true,
        mobileOrder: 16
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
  }, [userDepartment, getBadgeValue]);

  return { cards, setCards, isLoading };
};
