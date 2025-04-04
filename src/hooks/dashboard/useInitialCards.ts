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
    console.log("Initializing cards for department:", userDepartment);

    const initialCards: ActionCardItem[] = [
      {
        id: 'comunicacao',
        title: "Comunicação",
        path: "/dashboard/comunicacao",
        iconId: "message-square-reply",
        color: getBgColor('blue-700'),
        width: "25",
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
      },
      {
        id: 'gerar-noticia',
        title: "Gerar Notícia",
        path: "/dashboard/comunicacao/cadastrar-release",
        iconId: "document-plus",
        color: getBgColor('lime-400'),
        width: "25",
        height: "2",
        type: "standard",
        displayMobile: true,
        mobileOrder: 10,
        allowedDepartments: ['comunicacao']
      },
      {
        id: 'ver-releases',
        title: "Ver Releases e Notícias",
        path: "/dashboard/comunicacao/releases",
        iconId: "file-text",
        color: getBgColor('blue-900'),
        width: "25",
        height: "2",
        type: "standard",
        displayMobile: true,
        mobileOrder: 11,
        allowedDepartments: ['comunicacao', 'gabinete']
      }
    ];

    const filteredCards = initialCards.filter(card => {
      if (card.allowedDepartments && card.allowedDepartments.length > 0) {
        if (!userDepartment) return true;
        return card.allowedDepartments.includes(userDepartment);
      }
      return true;
    });

    console.log(`Filtered ${initialCards.length} cards to ${filteredCards.length} based on department:`, userDepartment);
    
    const sortedCards = filteredCards.sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999));
    setCards(sortedCards);
    setIsLoading(false);
  }, [userDepartment, getBadgeValue]);

  return { cards, setCards, isLoading };
};
