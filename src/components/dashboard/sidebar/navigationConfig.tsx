
import React from 'react';
import { 
  Home, 
  MessageCircle, 
  BarChart2, 
  TrendingUp,
  FileText,
  Sparkles
} from 'lucide-react';

// Navigation configuration for the sidebar
export const getNavigationSections = () => [
  // Seção 1: Início
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
    path: '/dashboard/comunicacao',
    isSection: false
  },
  // Seção 3: Cadastrar Release
  {
    id: 'cadastrar-release',
    icon: <Sparkles size={20} />,
    label: 'Cadastrar Release',
    path: '/dashboard/comunicacao/cadastrar-release',
    isSection: false
  },
  // Seção 4: Releases e Notícias
  {
    id: 'releases',
    icon: <FileText size={20} />,
    label: 'Releases e Notícias',
    path: '/dashboard/comunicacao/releases',
    isSection: false
  },
  // Seção 5: Relatórios
  {
    id: 'relatorios',
    icon: <BarChart2 size={20} />,
    label: 'Relatórios',
    path: '/dashboard/comunicacao/relatorios',
    isSection: false
  },
  // Seção 6: Ranking das Subs
  {
    id: 'ranking',
    icon: <TrendingUp size={20} />,
    label: 'Ranking da Zeladoria',
    path: '/dashboard/zeladoria/ranking-subs',
    isSection: false
  }
];
