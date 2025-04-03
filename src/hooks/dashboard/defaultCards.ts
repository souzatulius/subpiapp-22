
import React from 'react';
import { ActionCardItem, CardColor } from '@/types/dashboard';

// Function to get icon component from ID
export function getIconComponentFromId(iconId: string) {
  const IconMap = {
    'chat-bubble-left': () => import('lucide-react').then(mod => mod.MessageSquare),
    'clipboard-document-check': () => import('lucide-react').then(mod => mod.ClipboardCheck),
    'document-text': () => import('lucide-react').then(mod => mod.FileText),
    'document-check': () => import('lucide-react').then(mod => mod.FileCheck),
    'document-plus': () => import('lucide-react').then(mod => mod.FilePlus),
    'list-bullet': () => import('lucide-react').then(mod => mod.List),
    'inbox-arrow-down': () => import('lucide-react').then(mod => mod.InboxIcon),
    'trophy': () => import('lucide-react').then(mod => mod.Trophy),
    'bar-chart-2': () => import('lucide-react').then(mod => mod.BarChart2),
    'check-circle': () => import('lucide-react').then(mod => mod.CheckCircle),
    'message-square-reply': () => import('lucide-react').then(mod => mod.MessageSquareReply),
    'plus-circle': () => import('lucide-react').then(mod => mod.PlusCircle),
    'list-filter': () => import('lucide-react').then(mod => mod.ListFilter),
    'message-circle': () => import('lucide-react').then(mod => mod.MessageCircle),
    'file-text': () => import('lucide-react').then(mod => mod.FileText),
    'search': () => import('lucide-react').then(mod => mod.Search),
    // Default case
    'default': () => import('lucide-react').then(mod => mod.MessageSquare),
  };
  
  const LoadedIcon = React.lazy(() => 
    IconMap[iconId] ? IconMap[iconId]() : IconMap['default']()
  );
  
  return (props: any) => (
    <React.Suspense fallback={<div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full" />}>
      <LoadedIcon {...props} />
    </React.Suspense>
  );
}

export const getDynamicCardDefaults = (userDepartment: string | null): ActionCardItem[] => {
  const getCardColor = (color: string): CardColor => {
    return color as CardColor;
  };
  
  const dynamicCards: ActionCardItem[] = [
    {
      id: 'smart-search',
      title: "O que vamos fazer?",
      type: "dynamic",
      iconId: "search",
      path: "",
      color: getCardColor('blue-light'),
      width: "100", // will occupy full width
      height: "1",
      dataSourceKey: "smartSearch",
      displayMobile: true,
      mobileOrder: 0,
      allowedDepartments: [],
    },
    {
      id: 'kpi-solicitacoes',
      title: "Solicitações de Imprensa",
      type: "dynamic",
      iconId: "chat-bubble-left",
      path: "",
      color: getCardColor('blue'),
      width: "25",
      height: "1",
      dataSourceKey: "kpi_solicitacoes",
      displayMobile: true,
      mobileOrder: 10,
      allowedDepartments: ['comunicacao', 'gabinete'],
    },
    // Add more cards as needed
  ];
  
  // Filter cards based on department restrictions
  return dynamicCards.filter(card => {
    if (card.allowedDepartments && card.allowedDepartments.length > 0) {
      return !userDepartment || card.allowedDepartments.includes(userDepartment);
    }
    return true;
  });
};
