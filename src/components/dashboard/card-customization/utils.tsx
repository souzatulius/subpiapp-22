
import { 
  ClipboardList, 
  MessageSquareReply, 
  FileCheck, 
  BarChart2, 
  Clock, 
  File, 
  Bell, 
  Building, 
  PenSquare, 
  Share, 
  Calendar, 
  Search, 
  PieChart, 
  LineChart, 
  AreaChart, 
  AlertTriangle, 
  CircleCheck, 
  User, 
  Users, 
  Settings
} from 'lucide-react';
import React from 'react';

// Icons available for selection
export const iconsData = [
  { id: 'clipboard-list', component: <ClipboardList className="h-6 w-6" />, label: 'Lista' },
  { id: 'message-square-reply', component: <MessageSquareReply className="h-6 w-6" />, label: 'Mensagem' },
  { id: 'file-check', component: <FileCheck className="h-6 w-6" />, label: 'Check' },
  { id: 'bar-chart-2', component: <BarChart2 className="h-6 w-6" />, label: 'Gráfico' },
  { id: 'clock', component: <Clock className="h-6 w-6" />, label: 'Relógio' },
  { id: 'file', component: <File className="h-6 w-6" />, label: 'Arquivo' },
  { id: 'bell', component: <Bell className="h-6 w-6" />, label: 'Sino' },
  { id: 'building', component: <Building className="h-6 w-6" />, label: 'Prédio' },
  { id: 'pen-square', component: <PenSquare className="h-6 w-6" />, label: 'Editar' },
  { id: 'share', component: <Share className="h-6 w-6" />, label: 'Compartilhar' },
  { id: 'calendar', component: <Calendar className="h-6 w-6" />, label: 'Calendário' },
  { id: 'search', component: <Search className="h-6 w-6" />, label: 'Pesquisa' },
  { id: 'pie-chart', component: <PieChart className="h-6 w-6" />, label: 'Gráfico Pizza' },
  { id: 'line-chart', component: <LineChart className="h-6 w-6" />, label: 'Gráfico Linha' },
  { id: 'area-chart', component: <AreaChart className="h-6 w-6" />, label: 'Gráfico Área' },
  { id: 'alert-triangle', component: <AlertTriangle className="h-6 w-6" />, label: 'Alerta' },
  { id: 'circle-check', component: <CircleCheck className="h-6 w-6" />, label: 'Marcado' },
  { id: 'user', component: <User className="h-6 w-6" />, label: 'Usuário' },
  { id: 'users', component: <Users className="h-6 w-6" />, label: 'Usuários' },
  { id: 'settings', component: <Settings className="h-6 w-6" />, label: 'Configurações' },
];

// Colors available for selection
export const colorData = [
  { id: 'blue', label: 'Azul', class: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 'blue-dark', label: 'Azul Escuro', class: 'bg-subpi-blue text-white border-subpi-blue' },
  { id: 'green', label: 'Verde', class: 'bg-green-50 text-green-600 border-green-100' },
  { id: 'orange', label: 'Laranja', class: 'bg-orange-50 text-orange-600 border-orange-100' },
  { id: 'orange-light', label: 'Âmbar', class: 'bg-amber-50 text-amber-600 border-amber-100' },
  { id: 'gray-light', label: 'Cinza Claro', class: 'bg-gray-50 text-gray-600 border-gray-100' },
  { id: 'gray-dark', label: 'Cinza Escuro', class: 'bg-gray-700 text-white border-gray-600' },
  { id: 'gray-ultra-light', label: 'Cinza Ultra Claro', class: 'bg-gray-25 text-gray-600 border-gray-50' },
];

// Utility to get icon component by ID
export const getIconComponentById = (iconId: string) => {
  const found = iconsData.find(icon => icon.id === iconId);
  if (found) {
    return found.component;
  }
  return <ClipboardList className="h-12 w-12" />;
};

// Utility to identify icon component type
export const identifyIconComponent = (component: React.ReactNode): string => {
  if (!component) return 'clipboard-list';
  
  const componentStr = component.toString() || '';
  
  const foundIcon = iconsData.find(icon => {
    const iconType = icon.component.type.name;
    return componentStr.includes(iconType);
  });
  
  return foundIcon?.id || 'clipboard-list';
};
