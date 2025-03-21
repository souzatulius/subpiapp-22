
import React from 'react';
import { 
  ClipboardList, 
  MessageSquareReply, 
  FileCheck, 
  BarChart2, 
  FileText, 
  Search, 
  BookOpen, 
  Bell, 
  Calendar, 
  Users, 
  Camera, 
  Image, 
  Flag, 
  Map, 
  Home, 
  Settings, 
  LayoutDashboard, 
  PieChart, 
  AlertTriangle
} from 'lucide-react';

// Define available icons
export const availableIcons = [
  { id: 'clipboard', component: <ClipboardList className="h-12 w-12" />, label: 'Prancheta' },
  { id: 'message', component: <MessageSquareReply className="h-12 w-12" />, label: 'Mensagem' },
  { id: 'check', component: <FileCheck className="h-12 w-12" />, label: 'Verificação' },
  { id: 'chart', component: <BarChart2 className="h-12 w-12" />, label: 'Gráfico' },
  { id: 'file', component: <FileText className="h-12 w-12" />, label: 'Documento' },
  { id: 'search', component: <Search className="h-12 w-12" />, label: 'Pesquisa' },
  { id: 'book', component: <BookOpen className="h-12 w-12" />, label: 'Livro' },
  { id: 'bell', component: <Bell className="h-12 w-12" />, label: 'Notificação' },
  { id: 'calendar', component: <Calendar className="h-12 w-12" />, label: 'Calendário' },
  { id: 'users', component: <Users className="h-12 w-12" />, label: 'Usuários' },
  { id: 'camera', component: <Camera className="h-12 w-12" />, label: 'Câmera' },
  { id: 'image', component: <Image className="h-12 w-12" />, label: 'Imagem' },
  { id: 'flag', component: <Flag className="h-12 w-12" />, label: 'Bandeira' },
  { id: 'map', component: <Map className="h-12 w-12" />, label: 'Mapa' },
  { id: 'home', component: <Home className="h-12 w-12" />, label: 'Casa' },
  { id: 'settings', component: <Settings className="h-12 w-12" />, label: 'Configurações' },
  { id: 'dashboard', component: <LayoutDashboard className="h-12 w-12" />, label: 'Dashboard' },
  { id: 'pie', component: <PieChart className="h-12 w-12" />, label: 'Gráfico Pizza' },
  { id: 'alert', component: <AlertTriangle className="h-12 w-12" />, label: 'Alerta' },
];

// Define color options
export const colorOptions = [
  { id: 'blue', label: 'Azul', value: 'blue', bgClass: 'bg-blue-500' },
  { id: 'blue-dark', label: 'Azul Escuro', value: 'blue-dark', bgClass: 'bg-subpi-blue' },
  { id: 'green', label: 'Verde', value: 'green', bgClass: 'bg-green-500' },
  { id: 'orange', label: 'Laranja', value: 'orange', bgClass: 'bg-orange-500' },
  { id: 'orange-light', label: 'Laranja Claro', value: 'orange-light', bgClass: 'bg-amber-500' },
  { id: 'purple', label: 'Roxo', value: 'purple', bgClass: 'bg-purple-500' },
  { id: 'red', label: 'Vermelho', value: 'red', bgClass: 'bg-red-500' },
  { id: 'gray-light', label: 'Cinza Claro', value: 'gray-light', bgClass: 'bg-gray-300' },
  { id: 'gray-dark', label: 'Cinza Escuro', value: 'gray-dark', bgClass: 'bg-gray-700' },
];

// Width options
export const widthOptions = [
  { id: '25', label: '25%', value: '25' },
  { id: '50', label: '50%', value: '50' },
  { id: '75', label: '75%', value: '75' },
  { id: '100', label: '100%', value: '100' },
];

// Height options
export const heightOptions = [
  { id: '1', label: '1 linha', value: '1' },
  { id: '2', label: '2 linhas', value: '2' },
];

// Define dashboard pages for redirection
export const dashboardPages = [
  { value: '/dashboard', label: 'Dashboard Principal' },
  { value: '/dashboard/comunicacao', label: 'Comunicação' },
  { value: '/dashboard/comunicacao/cadastrar', label: 'Nova Demanda' },
  { value: '/dashboard/comunicacao/responder', label: 'Responder Demandas' },
  { value: '/dashboard/comunicacao/aprovar-nota', label: 'Aprovar Nota' },
  { value: '/dashboard/comunicacao/relatorios', label: 'Relatórios de Comunicação' },
  { value: '/dashboard/comunicacao/consultar-demandas', label: 'Consultar Demandas' },
  { value: '/dashboard/comunicacao/consultar-notas', label: 'Consultar Notas' },
  { value: '/dashboard/comunicacao/criar-nota', label: 'Criar Nota Oficial' },
  { value: '/dashboard/zeladoria/ranking-subs', label: 'Ranking Subprefeituras' },
  { value: '/dashboard/projetos', label: 'Projetos' },
  { value: '/dashboard/projetos/relatorios', label: 'Relatórios de Projetos' }
];

// Helper function to identify which icon is being used
export const identifyIconComponent = (iconElement: React.ReactNode): string => {
  if (!iconElement || typeof iconElement !== 'object') return 'clipboard';
  
  const element = iconElement as any;
  
  if (!element.type || !element.props || !element.props.className) return 'clipboard';
  
  if (element.props.className.includes('h-12 w-12')) {
    if (element.type === ClipboardList) return 'clipboard';
    if (element.type === MessageSquareReply) return 'message';
    if (element.type === FileCheck) return 'check';
    if (element.type === BarChart2) return 'chart';
    if (element.type === FileText) return 'file';
    if (element.type === Search) return 'search';
    if (element.type === BookOpen) return 'book';
    if (element.type === Bell) return 'bell';
    if (element.type === Calendar) return 'calendar';
    if (element.type === Users) return 'users';
    if (element.type === Camera) return 'camera';
    if (element.type === Image) return 'image';
    if (element.type === Flag) return 'flag';
    if (element.type === Map) return 'map';
    if (element.type === Home) return 'home';
    if (element.type === Settings) return 'settings';
    if (element.type === LayoutDashboard) return 'dashboard';
    if (element.type === PieChart) return 'pie';
    if (element.type === AlertTriangle) return 'alert';
  }
  
  return 'clipboard';
};

// Find icon component by ID
export const getIconComponentById = (id: string): React.ReactNode => {
  const icon = availableIcons.find(icon => icon.id === id);
  return icon ? icon.component : availableIcons[0].component;
};

// Get the selected color for preview
export const getColorClass = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'blue-dark':
      return 'bg-subpi-blue text-white border-subpi-blue';
    case 'green':
      return 'bg-green-50 text-green-600 border-green-100';
    case 'orange':
      return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'orange-light':
      return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'purple':
      return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'red':
      return 'bg-red-50 text-red-600 border-red-100';
    case 'gray-light':
      return 'bg-gray-50 text-gray-600 border-gray-100';
    case 'gray-dark':
      return 'bg-gray-700 text-white border-gray-600';
    default:
      return 'bg-blue-50 text-blue-600 border-blue-100';
  }
};
