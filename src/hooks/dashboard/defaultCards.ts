import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';

export const getDefaultCommunicationCards = (displayMobile: boolean = true): ActionCardItem[] => {
  return [
    {
      id: `new-communication-${uuidv4()}`,
      title: "Nova Demanda",
      subtitle: "Cadastre uma nova demanda de comunicação",
      iconId: "message-square-reply",
      path: "/dashboard/comunicacao/cadastrar",
      color: "blue",
      type: "standard",
      width: "50",
      height: "1",
      displayMobile: displayMobile,
      mobileOrder: 1
    },
    {
      id: `approve-official-note-${uuidv4()}`,
      title: "Aprovar Notas",
      subtitle: "Aprove notas oficiais pendentes",
      iconId: "file-check",
      path: "/dashboard/comunicacao/aprovar-nota",
      color: "green",
      type: "standard",
      width: "50",
      height: "1",
      displayMobile: displayMobile,
      mobileOrder: 2
    },
    {
      id: `smart-search-${uuidv4()}`,
      title: "Pesquisa Inteligente",
      subtitle: "Busque ações rapidamente",
      iconId: "search",
      path: "",
      color: "blue-light",
      type: "smart_search",
      isSearch: true,
      width: "50",
      height: "1",
      displayMobile: displayMobile,
      mobileOrder: 1
    },
  ];
};

export const getIconComponentFromId = (iconId: string) => {
  const IconMap = {
    'clipboard-list': () => import('lucide-react').then(mod => mod.ClipboardList),
    'message-square-reply': () => import('lucide-react').then(mod => mod.MessageSquareReply),
    'file-check': () => import('lucide-react').then(mod => mod.FileCheck),
    'bar-chart-2': () => import('lucide-react').then(mod => mod.BarChart2),
    'plus-circle': () => import('lucide-react').then(mod => mod.PlusCircle),
    'search': () => import('lucide-react').then(mod => mod.Search),
    'clock': () => import('lucide-react').then(mod => mod.Clock),
    'alert-triangle': () => import('lucide-react').then(mod => mod.AlertTriangle),
    'check-circle': () => import('lucide-react').then(mod => mod.CheckCircle),
    'file-text': () => import('lucide-react').then(mod => mod.FileText),
    'list-filter': () => import('lucide-react').then(mod => mod.ListFilter),
    // Add more icons as needed
  };
  
  const LoadedIcon = React.lazy(() => 
    IconMap[iconId]?.() || import('lucide-react').then(mod => ({ default: mod.ClipboardList }))
  );
  
  return (props: any) => (
    <React.Suspense fallback={<div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full" />}>
      <LoadedIcon {...props} />
    </React.Suspense>
  );
};
