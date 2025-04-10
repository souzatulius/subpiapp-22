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

export const iconsData = [
  { id: 'clipboard-list', label: 'Cadastrar Demanda', component: <Clipboard className="h-5 w-5" /> },
  { id: 'message-square', label: 'Responder Demanda', component: <MessageSquare className="h-5 w-5" /> },
  { id: 'file-text', label: 'Criar Nota Oficial', component: <FileText className="h-5 w-5" /> },
  { id: 'check-circle', label: 'Aprovar Nota Oficial', component: <CheckCircle className="h-5 w-5" /> },
  { id: 'search', label: 'Consultar Notas', component: <Search className="h-5 w-5" /> },
  { id: 'list', label: 'Consultar Demandas', component: <List className="h-5 w-5" /> },
  { id: 'layout-dashboard', label: 'Dashboard', component: <Home className="h-5 w-5" /> },
  { id: 'settings', label: 'Configurações', component: <Settings className="h-5 w-5" /> },
  { id: 'users', label: 'Usuários', component: <User className="h-5 w-5" /> },
  { id: 'bell', label: 'Notificações', component: <Bell className="h-5 w-5" /> },
  { id: 'briefcase', label: 'Cargos', component: <Briefcase className="h-5 w-5" /> },
  { id: 'file-stack', label: 'Serviços', component: <FileText className="h-5 w-5" /> },
  { id: 'image', label: 'Tipos de Mídia', component: <Image className="h-5 w-5" /> },
  { id: 'inbox', label: 'Origem das Demandas', component: <Box className="h-5 w-5" /> },
  { id: 'map-pin', label: 'Distritos e Bairros', component: <MapPin className="h-5 w-5" /> },
];

export const getIconComponentById = (id: string): JSX.Element => {
  const icon = iconsData.find(icon => icon.id === id);
  return icon?.component || <Clipboard className="h-5 w-5" />;
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
  
  return 'clipboard-list';
};
