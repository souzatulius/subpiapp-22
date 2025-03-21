
import React from 'react';
import { 
  Home, 
  MessageCircle, 
  FileText, 
  BarChart2, 
  Settings, 
  TrendingUp,
  PlusCircle,
  MessageSquareReply,
  FileCheck,
  Search,
  BookOpen,
  LayoutDashboard
} from 'lucide-react';

// Navigation configuration for the sidebar
export const getNavigationSections = () => [
  // Seção 1: Página Principal
  {
    id: 'inicio',
    icon: <Home size={20} />,
    label: 'Início',
    path: '/dashboard',
    isSection: false
  },
  // Seção 2: Comunicação
  {
    id: 'comunicacao',
    icon: <MessageCircle size={20} />,
    label: 'Comunicação',
    isSection: true,
    subSections: [
      {
        id: 'impresa',
        label: 'Solicitações da Imprensa',
        isSubSection: true,
        items: [
          {
            icon: <PlusCircle size={18} />,
            label: 'Nova Demanda',
            path: '/dashboard/comunicacao/cadastrar'
          },
          {
            icon: <Search size={18} />,
            label: 'Consultar Demandas',
            path: '/dashboard/comunicacao/consultar-demandas'
          },
          {
            icon: <MessageSquareReply size={18} />,
            label: 'Responder Demandas',
            path: '/dashboard/comunicacao/responder'
          }
        ]
      },
      {
        id: 'notas',
        label: 'Notas Oficiais',
        isSubSection: true,
        items: [
          {
            icon: <FileText size={18} />,
            label: 'Nova Nota',
            path: '/dashboard/comunicacao/criar-nota'
          },
          {
            icon: <FileCheck size={18} />,
            label: 'Aprovar Nota',
            path: '/dashboard/comunicacao/aprovar-nota'
          },
          {
            icon: <BookOpen size={18} />,
            label: 'Consultar Notas',
            path: '/dashboard/comunicacao/consultar-notas'
          }
        ]
      }
    ]
  },
  // Seção 3: Relatórios (changed from menu item to section)
  {
    id: 'relatorios',
    icon: <BarChart2 size={20} />,
    label: 'Relatórios',
    path: '/dashboard/comunicacao/relatorios',
    isSection: false
  },
  // Seção 4: Ranking das Subs (changed from menu item to section)
  {
    id: 'zeladoria',
    icon: <TrendingUp size={20} />,
    label: 'Ranking das Subs',
    path: '/dashboard/zeladoria/ranking-subs',
    isSection: false
  },
  // Seção 5: Ajustes (only shown to admins)
  {
    id: 'ajustes',
    icon: <Settings size={20} />,
    label: 'Ajustes',
    path: '/settings',
    isSection: false,
    adminOnly: true
  }
];
