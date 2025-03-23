
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
  Settings,
  Map,
  Clipboard,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  Ticket,
  Inbox,
  Database,
  BookOpen,
  HelpCircle,
  Info,
  ArrowUpDown,
  CloudUpload,
  Send,
  Printer,
  ExternalLink
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
  { id: 'map', component: <Map className="h-6 w-6" />, label: 'Mapa' },
  { id: 'clipboard', component: <Clipboard className="h-6 w-6" />, label: 'Prancheta' },
  { id: 'file-text', component: <FileText className="h-6 w-6" />, label: 'Documento' },
  { id: 'mail', component: <Mail className="h-6 w-6" />, label: 'Email' },
  { id: 'phone', component: <Phone className="h-6 w-6" />, label: 'Telefone' },
  { id: 'shield-check', component: <ShieldCheck className="h-6 w-6" />, label: 'Segurança' },
  { id: 'ticket', component: <Ticket className="h-6 w-6" />, label: 'Ticket' },
  { id: 'inbox', component: <Inbox className="h-6 w-6" />, label: 'Caixa de Entrada' },
  { id: 'database', component: <Database className="h-6 w-6" />, label: 'Banco de Dados' },
  { id: 'book-open', component: <BookOpen className="h-6 w-6" />, label: 'Livro' },
  { id: 'help-circle', component: <HelpCircle className="h-6 w-6" />, label: 'Ajuda' },
  { id: 'info', component: <Info className="h-6 w-6" />, label: 'Informação' },
  { id: 'arrow-up-down', component: <ArrowUpDown className="h-6 w-6" />, label: 'Ordenar' },
  { id: 'cloud-upload', component: <CloudUpload className="h-6 w-6" />, label: 'Upload' },
  { id: 'send', component: <Send className="h-6 w-6" />, label: 'Enviar' },
  { id: 'printer', component: <Printer className="h-6 w-6" />, label: 'Impressora' },
  { id: 'external-link', component: <ExternalLink className="h-6 w-6" />, label: 'Link Externo' },
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

// Dashboard pages for navigation
export const dashboardPages = [
  { value: '/dashboard', label: 'Dashboard' },
  { value: '/dashboard/comunicacao/cadastrar', label: 'Cadastrar Demanda' },
  { value: '/dashboard/comunicacao/responder', label: 'Responder Demandas' },
  { value: '/dashboard/comunicacao/consultar-demandas', label: 'Consultar Demandas' },
  { value: '/dashboard/comunicacao/criar-nota', label: 'Criar Nota Oficial' },
  { value: '/dashboard/comunicacao/aprovar-nota', label: 'Aprovar Nota Oficial' },
  { value: '/dashboard/comunicacao/consultar-notas', label: 'Consultar Notas' },
  { value: '/dashboard/comunicacao/relatorios', label: 'Relatórios' },
  { value: '/dashboard/zeladoria/ranking-subs', label: 'Ranking de Subsecretarias' },
  { value: '/dashboard/comunicacao/comunicacao', label: 'Dashboard Comunicação' },
  { value: '/dashboard/comunicacao/notas', label: 'Dashboard Notas' },
  { value: '/settings', label: 'Configurações' },
];

// Width options for card customization
export const widthOptions = [
  { id: "25", value: "25", label: "25%" },
  { id: "50", value: "50", label: "50%" },
  { id: "75", value: "75", label: "75%" },
  { id: "100", value: "100", label: "100%" },
];

// Height options for card customization
export const heightOptions = [
  { id: "1", value: "1", label: "Padrão" },
  { id: "2", value: "2", label: "Duplo" },
];

// Utility to get icon component by ID
export const getIconComponentById = (iconId: string) => {
  const found = iconsData.find(icon => icon.id === iconId);
  if (found) {
    return found.component;
  }
  return <ClipboardList className="h-12 w-12" />;
};

// Utility to get color class by color ID
export const getColorClass = (colorId: string) => {
  const found = colorData.find(color => color.id === colorId);
  if (found) {
    return found.class;
  }
  return 'bg-blue-50 text-blue-600 border-blue-100';
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
