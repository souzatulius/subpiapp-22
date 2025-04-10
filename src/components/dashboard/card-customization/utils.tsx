import { FileText, Activity, Bell, Calendar, CheckCircle, Clock, HelpCircle, Home, BarChart2, Info, Mail, MapPin, MessageSquare, Phone, Settings, ShoppingCart, Star, User, Zap, Box, Briefcase, Archive, Award, BarChart, BookOpen, Camera, Cast, Clipboard, Coffee, Command, Compass, CreditCard, Database, Download, Edit, Eye, Facebook, Filter, Folder, Gift, Github, Globe, Heart, Image, Instagram, Key, Layers, LifeBuoy, Link, Linkedin, List, Lock, Map, Monitor, Music, Package, Paperclip, PenTool, Percent, PieChart, Printer, Radio, RefreshCw, Save, Search, Send, Server, Share2, Slash, Sliders, Smartphone, Speaker, Square, Tag, Target, Terminal, ThumbsUp, Trash2, Truck, Tv, Twitter, Umbrella, Upload, Video, Wifi, Youtube } from 'lucide-react';
import React from 'react';

export interface WidthOption {
  id: string;
  value: string;
  label: string;
}

export interface HeightOption {
  id: string;
  value: string;
  label: string;
}

export const widthOptions: WidthOption[] = [
  { id: '25', value: '25', label: '25%' },
  { id: '50', value: '50', label: '50%' },
  { id: '75', value: '75', label: '75%' },
  { id: '100', value: '100', label: '100%' },
];

export const heightOptions: HeightOption[] = [
  { id: '0.5', value: '0.5', label: 'Compacto' },
  { id: '1', value: '1', label: 'Padrão' },
  { id: '2', value: '2', label: 'Médio' },
  { id: '3', value: '3', label: 'Grande' },
  { id: '4', value: '4', label: 'Extra Grande' },
];

export const getColorClass = (color: string): string => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-950 border-blue-100';
    case 'blue-dark':
      return 'bg-blue-950 text-white border-blue-900';
    case 'orange':
      return 'bg-orange-50 text-orange-950 border-orange-100';
    case 'orange-light':
      return 'bg-orange-500 text-white border-orange-600';
    case 'orange-600':
      return 'bg-orange-600 text-white border-orange-700';
    case 'gray-light':
      return 'bg-gray-25 text-gray-700 border-gray-100';
    case 'gray-dark':
      return 'bg-gray-400 text-white border-gray-500';
    case 'green':
      return 'bg-lime-50 text-lime-950 border-lime-100';
    case 'lime':
      return 'bg-lime-500 text-white border-lime-600';
    case 'gray-ultra-light':
      return 'bg-gray-25 text-gray-700 border-gray-50';
    case 'deep-blue':
      return 'bg-[#051A2C] text-white border-blue-950';
    case 'blue-vivid':
      return 'bg-[#0066FF] text-white border-blue-600';
    case 'blue-light':
      return 'bg-[#66B2FF] text-white border-blue-400';
    case 'green-neon':
      return 'bg-[#66FF66] text-gray-800 border-green-400';
    case 'green-dark':
      return 'bg-[#00CC00] text-gray-800 border-green-700';
    case 'gray-lighter':
      return 'bg-[#FAFAFA] text-gray-800 border-gray-200';
    case 'gray-medium':
      return 'bg-[#D4D4D4] text-gray-800 border-gray-400';
    case 'orange-dark':
      return 'bg-[#F25C05] text-white border-orange-600';
    default:
      return 'bg-blue-50 text-blue-950 border-blue-100';
  }
};

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

// Add the icons data
const iconsData = [
  { id: 'Activity', component: Activity },
  { id: 'Archive', component: Archive },
  { id: 'Award', component: Award },
  { id: 'BarChart', component: BarChart },
  { id: 'BarChart2', component: BarChart2 },
  { id: 'Bell', component: Bell },
  { id: 'Box', component: Box },
  { id: 'BookOpen', component: BookOpen },
  { id: 'Briefcase', component: Briefcase },
  { id: 'Calendar', component: Calendar },
  { id: 'Camera', component: Camera },
  { id: 'Cast', component: Cast },
  { id: 'CheckCircle', component: CheckCircle },
  { id: 'Clipboard', component: Clipboard },
  { id: 'Clock', component: Clock },
  { id: 'Coffee', component: Coffee },
  { id: 'Command', component: Command },
  { id: 'Compass', component: Compass },
  { id: 'CreditCard', component: CreditCard },
  { id: 'Database', component: Database },
  { id: 'Download', component: Download },
  { id: 'Edit', component: Edit },
  { id: 'Eye', component: Eye },
  { id: 'Facebook', component: Facebook },
  { id: 'FileText', component: FileText },
  { id: 'Filter', component: Filter },
  { id: 'Folder', component: Folder },
  { id: 'Gift', component: Gift },
  { id: 'Github', component: Github },
  { id: 'Globe', component: Globe },
  { id: 'Heart', component: Heart },
  { id: 'HelpCircle', component: HelpCircle },
  { id: 'Home', component: Home },
  { id: 'Image', component: Image },
  { id: 'Info', component: Info },
  { id: 'Instagram', component: Instagram },
  { id: 'Key', component: Key },
  { id: 'Layers', component: Layers },
  { id: 'LifeBuoy', component: LifeBuoy },
  { id: 'Link', component: Link },
  { id: 'Linkedin', component: Linkedin },
  { id: 'List', component: List },
  { id: 'Lock', component: Lock },
  { id: 'Mail', component: Mail },
  { id: 'Map', component: Map },
  { id: 'MapPin', component: MapPin },
  { id: 'MessageSquare', component: MessageSquare },
  { id: 'Monitor', component: Monitor },
  { id: 'Music', component: Music },
  { id: 'Package', component: Package },
  { id: 'Paperclip', component: Paperclip },
  { id: 'PenTool', component: PenTool },
  { id: 'Percent', component: Percent },
  { id: 'Phone', component: Phone },
  { id: 'PieChart', component: PieChart },
  { id: 'Printer', component: Printer },
  { id: 'Radio', component: Radio },
  { id: 'RefreshCw', component: RefreshCw },
  { id: 'Save', component: Save },
  { id: 'Search', component: Search },
  { id: 'Send', component: Send },
  { id: 'Server', component: Server },
  { id: 'Settings', component: Settings },
  { id: 'Share2', component: Share2 },
  { id: 'ShoppingCart', component: ShoppingCart },
  { id: 'Slash', component: Slash },
  { id: 'Sliders', component: Sliders },
  { id: 'Smartphone', component: Smartphone },
  { id: 'Speaker', component: Speaker },
  { id: 'Square', component: Square },
  { id: 'Star', component: Star },
  { id: 'Tag', component: Tag },
  { id: 'Target', component: Target },
  { id: 'Terminal', component: Terminal },
  { id: 'ThumbsUp', component: ThumbsUp },
  { id: 'Trash2', component: Trash2 },
  { id: 'Truck', component: Truck },
  { id: 'Tv', component: Tv },
  { id: 'Twitter', component: Twitter },
  { id: 'Umbrella', component: Umbrella },
  { id: 'Upload', component: Upload },
  { id: 'User', component: User },
  { id: 'Video', component: Video },
  { id: 'Wifi', component: Wifi },
  { id: 'Youtube', component: Youtube },
  { id: 'Zap', component: Zap },
];

// Add the getAllIcons function
export const getAllIcons = () => {
  return iconsData;
};

export const getIconComponentById = (id: string): JSX.Element => {
  const icon = iconsData.find(icon => icon.id === id);
  return icon?.component ? React.createElement(icon.component, { className: "h-5 w-5" }) : <Clipboard className="h-5 w-5" />;
};

export const identifyIconComponent = (icon: React.ReactNode): string => {
  if (React.isValidElement(icon)) {
    const iconType = icon.type;
    
    for (const item of iconsData) {
      if (React.isValidElement(item.component) && item.component.type === iconType) {
        return item.id;
      }
    }
  }
  
  return 'Activity';
};
