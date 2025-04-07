
import React from 'react';
import { 
  Home, 
  FileText, 
  Mail, 
  MessageSquare, 
  Settings, 
  Edit, 
  List,
  Send,
  Bell,
  Newspaper,
  FileQuestion
} from 'lucide-react';

export const getNavigationSections = () => {
  return [
    {
      id: 'home',
      label: 'Página Inicial',
      path: '/dashboard',
      icon: <Home size={20} />,
      isSection: false,
    },
    {
      id: 'comunicacao',
      label: 'Comunicação',
      path: '/dashboard/comunicacao',
      icon: <MessageSquare size={20} />,
      isSection: true,
      items: [
        {
          id: 'cadastrar',
          label: 'Cadastrar Demanda',
          path: '/dashboard/comunicacao/cadastrar',
          icon: <Edit size={16} />,
        },
        {
          id: 'consultar',
          label: 'Consultar Demandas',
          path: '/dashboard/comunicacao/consultar',
          icon: <List size={16} />,
        },
        {
          id: 'responder',
          label: 'Responder Demandas',
          path: '/dashboard/comunicacao/responder',
          icon: <Send size={16} />,
        },
        {
          id: 'notas',
          label: 'Notas Oficiais',
          path: '/dashboard/comunicacao/notas',
          icon: <FileText size={16} />,
        },
        {
          id: 'criar-nota',
          label: 'Criar Nota',
          path: '/dashboard/comunicacao/criar-nota',
          icon: <FileText size={16} />,
        },
        {
          id: 'aprovar-nota',
          label: 'Aprovar Nota',
          path: '/dashboard/comunicacao/aprovar-nota',
          icon: <Bell size={16} />,
        },
        {
          id: 'consultar-notas',
          label: 'Consultar Notas',
          path: '/dashboard/comunicacao/consultar-notas',
          icon: <Newspaper size={16} />,
        },
        {
          id: 'relatorios',
          label: 'Relatórios',
          path: '/dashboard/comunicacao/relatorios',
          icon: <FileQuestion size={16} />,
        },
      ],
    },
    {
      id: 'settings',
      label: 'Configurações',
      path: '/settings',
      icon: <Settings size={20} />,
      isSection: false,
    },
  ];
};

export default getNavigationSections;
