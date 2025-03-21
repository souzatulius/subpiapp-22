
import React from 'react';
import { 
  ClipboardList, FileCheck, MessageSquareReply, BarChart2, 
  BellRing, Search, PlusCircle, FileText, Home, BookOpen,
  Users, Settings, BarChart, ChevronRight, Clock, Calendar,
  Bell, Flag, AlertCircle, CheckCircle, Info, LucideIcon
} from 'lucide-react';

// Color options for cards
export const colorOptions = [
  { id: 'blue', value: 'blue', label: 'Azul', bgClass: 'bg-blue-50' },
  { id: 'green', value: 'green', label: 'Verde', bgClass: 'bg-green-50' },
  { id: 'orange', value: 'orange', label: 'Laranja', bgClass: 'bg-orange-50' },
  { id: 'gray-light', value: 'gray-light', label: 'Cinza Claro', bgClass: 'bg-gray-50' },
  { id: 'gray-dark', value: 'gray-dark', label: 'Cinza Escuro', bgClass: 'bg-gray-700' },
  { id: 'blue-dark', value: 'blue-dark', label: 'Azul Escuro', bgClass: 'bg-subpi-blue' },
  { id: 'orange-light', value: 'orange-light', label: 'Laranja Claro', bgClass: 'bg-amber-50' },
  { id: 'gray-ultra-light', value: 'gray-ultra-light', label: 'Cinza Muito Claro', bgClass: 'bg-gray-25' },
];

// Width options
export const widthOptions = [
  { id: 'width-25', value: '25', label: '25%' },
  { id: 'width-50', value: '50', label: '50%' },
  { id: 'width-75', value: '75', label: '75%' },
  { id: 'width-100', value: '100', label: '100%' },
];

// Height options
export const heightOptions = [
  { id: 'height-1', value: '1', label: '1x' },
  { id: 'height-2', value: '2', label: '2x' },
];

// Available icons for selection
export const availableIcons = [
  { id: 'clipboard-list', label: '', component: <ClipboardList className="h-8 w-8" /> },
  { id: 'file-check', label: '', component: <FileCheck className="h-8 w-8" /> },
  { id: 'message-square-reply', label: '', component: <MessageSquareReply className="h-8 w-8" /> },
  { id: 'bar-chart-2', label: '', component: <BarChart2 className="h-8 w-8" /> },
  { id: 'bell-ring', label: '', component: <BellRing className="h-8 w-8" /> },
  { id: 'search', label: '', component: <Search className="h-8 w-8" /> },
  { id: 'plus-circle', label: '', component: <PlusCircle className="h-8 w-8" /> },
  { id: 'file-text', label: '', component: <FileText className="h-8 w-8" /> },
  { id: 'home', label: '', component: <Home className="h-8 w-8" /> },
  { id: 'book-open', label: '', component: <BookOpen className="h-8 w-8" /> },
  { id: 'users', label: '', component: <Users className="h-8 w-8" /> },
  { id: 'settings', label: '', component: <Settings className="h-8 w-8" /> },
  { id: 'bar-chart', label: '', component: <BarChart className="h-8 w-8" /> },
  { id: 'chevron-right', label: '', component: <ChevronRight className="h-8 w-8" /> },
  { id: 'clock', label: '', component: <Clock className="h-8 w-8" /> },
  { id: 'calendar', label: '', component: <Calendar className="h-8 w-8" /> },
  { id: 'bell', label: '', component: <Bell className="h-8 w-8" /> },
  { id: 'flag', label: '', component: <Flag className="h-8 w-8" /> },
  { id: 'alert-circle', label: '', component: <AlertCircle className="h-8 w-8" /> },
  { id: 'check-circle', label: '', component: <CheckCircle className="h-8 w-8" /> },
  { id: 'info', label: '', component: <Info className="h-8 w-8" /> },
];

// Dashboard pages for redirection
export const dashboardPages = [
  { value: '/dashboard/comunicacao/cadastrar', label: 'Nova Demanda' },
  { value: '/dashboard/comunicacao/responder', label: 'Responder Demandas' },
  { value: '/dashboard/comunicacao/aprovar-nota', label: 'Aprovar Nota' },
  { value: '/dashboard/comunicacao/relatorios', label: 'Relatórios' },
  { value: '/dashboard/comunicacao/criar-nota', label: 'Criar Nota Oficial' },
  { value: '/dashboard/comunicacao/consultar-notas', label: 'Consultar Notas' },
  { value: '/dashboard/comunicacao/consultar-demandas', label: 'Consultar Demandas' },
  { value: '/dashboard/zeladoria/ranking-subs', label: 'Ranking de Subprefeituras' },
  { value: '/dashboard', label: 'Dashboard Principal' },
  { value: '/dashboard/configuracoes', label: 'Configurações' },
];

// Function to get color classes based on color selection
export const getColorClass = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100';
    case 'blue-dark':
      return 'bg-subpi-blue text-white border-subpi-blue hover:bg-subpi-blue-dark';
    case 'green':
      return 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100';
    case 'orange':
      return 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100';
    case 'orange-light':
      return 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100';
    case 'gray-light':
      return 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100';
    case 'gray-dark':
      return 'bg-gray-700 text-white border-gray-600 hover:bg-gray-800';
    case 'gray-ultra-light':
      return 'bg-gray-25 text-gray-600 border-gray-50 hover:bg-gray-50';
    default:
      return 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100';
  }
};

// Utility to identify icon component from React node
export const identifyIconComponent = (iconComponent: React.ReactNode) => {
  if (!iconComponent) return 'clipboard-list';
  
  const componentString = iconComponent.toString();
  
  // Find matching icon
  for (const icon of availableIcons) {
    if (componentString.includes(icon.id)) {
      return icon.id;
    }
  }
  
  return 'clipboard-list'; // Default fallback
};

// Get icon component by ID
export const getIconComponentById = (id: string) => {
  const icon = availableIcons.find(icon => icon.id === id);
  return icon ? icon.component : <ClipboardList className="h-12 w-12" />;
};

