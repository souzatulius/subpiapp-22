import {
  ClipboardList,
  MessageSquare,
  FileText,
  CheckCircle,
  Search,
  List,
  LayoutDashboard,
  Settings,
  Users,
  Bell,
  Briefcase,
  FileStack,
  Image,
  Inbox,
  MapPin,
} from 'lucide-react';
import React from 'react';

// Function to get color class based on color name
export const getColorClass = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'green':
      return 'bg-green-50 text-green-600 border border-green-200';
    case 'orange':
      return 'bg-orange-50 text-orange-600 border border-orange-200';
    case 'gray-light':
      return 'bg-gray-50 text-gray-600 border border-gray-200';
    case 'gray-dark':
      return 'bg-gray-700 text-white border border-gray-600';
    case 'blue-dark':
      return 'bg-blue-600 text-white border border-blue-700';
    case 'orange-light':
      return 'bg-amber-50 text-amber-600 border border-amber-100';
    case 'orange-600':
      return 'bg-orange-600 text-white border border-orange-700';
    case 'gray-ultra-light':
      return 'bg-gray-100 text-gray-600 border border-gray-200';
    case 'lime':
      return 'bg-lime-500 text-white border border-lime-600';
    default:
      return 'bg-blue-50 text-blue-600 border border-blue-200';
  }
};

// List of dashboard pages for the select dropdown
export const dashboardPages = [
  { value: '/dashboard', label: 'Dashboard' },
  { value: '/dashboard/comunicacao', label: 'Comunicação' },
  { value: '/dashboard/comunicacao/cadastrar-demanda', label: 'Cadastrar Demanda' },
  { value: '/dashboard/comunicacao/responder-demandas', label: 'Responder Demandas' },
  { value: '/dashboard/comunicacao/criar-nota-oficial', label: 'Criar Nota Oficial' },
  { value: '/dashboard/comunicacao/aprovar-nota-oficial', label: 'Aprovar Nota Oficial' },
  { value: '/dashboard/comunicacao/consultar-notas', label: 'Consultar Notas' },
  { value: '/dashboard/comunicacao/consultar-demandas', label: 'Consultar Demandas' },
  { value: '/settings', label: 'Configurações' },
  { value: '/settings?tab=usuarios', label: 'Usuários (Configurações)' },
  { value: '/settings?tab=notificacoes', label: 'Notificações (Configurações)' },
  { value: '/settings?tab=cargos', label: 'Cargos (Configurações)' },
  { value: '/settings?tab=servicos', label: 'Serviços (Configurações)' },
  { value: '/settings?tab=tipos_midia', label: 'Tipos de Mídia (Configurações)' },
  { value: '/settings?tab=origens_demanda', label: 'Origem das Demandas (Configurações)' },
  { value: '/settings?tab=distritos_bairros', label: 'Distritos e Bairros (Configurações)' },
  { value: '/settings?tab=areas', label: 'Áreas de Coordenação (Configurações)' },
];

// Define the icon data with proper React elements
export const iconsData = [
  { id: 'clipboard-list', label: 'Cadastrar Demanda', component: <ClipboardList className="h-5 w-5" /> },
  { id: 'message-square', label: 'Responder Demanda', component: <MessageSquare className="h-5 w-5" /> },
  { id: 'file-text', label: 'Criar Nota Oficial', component: <FileText className="h-5 w-5" /> },
  { id: 'check-circle', label: 'Aprovar Nota Oficial', component: <CheckCircle className="h-5 w-5" /> },
  { id: 'search', label: 'Consultar Notas', component: <Search className="h-5 w-5" /> },
  { id: 'list', label: 'Consultar Demandas', component: <List className="h-5 w-5" /> },
  { id: 'layout-dashboard', label: 'Dashboard', component: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'settings', label: 'Configurações', component: <Settings className="h-5 w-5" /> },
  { id: 'users', label: 'Usuários', component: <Users className="h-5 w-5" /> },
  { id: 'bell', label: 'Notificações', component: <Bell className="h-5 w-5" /> },
  { id: 'briefcase', label: 'Cargos', component: <Briefcase className="h-5 w-5" /> },
  { id: 'file-stack', label: 'Serviços', component: <FileStack className="h-5 w-5" /> },
  { id: 'image', label: 'Tipos de Mídia', component: <Image className="h-5 w-5" /> },
  { id: 'inbox', label: 'Origem das Demandas', component: <Inbox className="h-5 w-5" /> },
  { id: 'map-pin', label: 'Distritos e Bairros', component: <MapPin className="h-5 w-5" /> },
];

// Function to get the icon component by its ID - returning a JSX Element
export const getIconComponentById = (id: string): JSX.Element => {
  const icon = iconsData.find(icon => icon.id === id);
  return icon?.component || <ClipboardList className="h-5 w-5" />;
};

// Function to identify the icon component based on its type
export const identifyIconComponent = (icon: React.ReactNode): string => {
  if (React.isValidElement(icon)) {
    const iconType = icon.type;
    
    // Find a matching icon by comparing the component types
    for (const item of iconsData) {
      if (React.isValidElement(item.component) && item.component.type === iconType) {
        return item.id;
      }
    }
  }
  
  return 'clipboard-list'; // Default fallback
};

export const widthOptions = [
  { id: 'w25', value: '25', label: '25%' },
  { id: 'w50', value: '50', label: '50%' },
  { id: 'w75', value: '75', label: '75%' },
  { id: 'w100', value: '100', label: '100%' },
];

export const heightOptions = [
  { id: 'h1', value: '1', label: 'Normal' },
  { id: 'h2', value: '2', label: 'Duplo' },
];
