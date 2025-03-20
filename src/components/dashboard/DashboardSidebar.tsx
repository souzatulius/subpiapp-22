import React from 'react';
import {
  HomeIcon,
  BarChartIcon,
  SettingsIcon,
  PlusSquare,
  FileText as FileTextIcon,
  UsersIcon
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const DashboardSidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { user } = useAuth();

  const navigationItems: NavItem[] = [
    {
      title: 'Dashboard',
      icon: <HomeIcon className="h-5 w-5" />,
      path: '/dashboard',
    },
    {
      title: 'Ranking Subprefeituras',
      icon: <BarChartIcon className="h-5 w-5" />,
      path: '/ranking-subprefeituras',
    },
    {
      title: 'Cadastrar Solicitação',
      icon: <PlusSquare className="h-5 w-5" />,
      path: '/cadastrar-demanda',
    },
    {
      title: 'Notas Oficiais',
      icon: <FileTextIcon className="h-5 w-5" />,
      path: '/notas-oficiais',
    },
    {
      title: 'Comunicações Oficiais',
      icon: <FileTextIcon className="h-5 w-5" />,
      path: '/comunicacoes-oficiais',
    },
  ];

  if (user?.email === 'admin@email.com') {
    navigationItems.push({
      title: 'Controle de Acesso',
      icon: <UsersIcon className="h-5 w-5" />,
      path: '/access-control',
    });
    navigationItems.push({
      title: 'Configurações',
      icon: <SettingsIcon className="h-5 w-5" />,
      path: '/settings',
    });
  }

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-transform duration-300 transform ${
        isOpen ? 'w-64 translate-x-0' : '-translate-x-full w-0'
      } fixed top-0 left-0 h-full lg:translate-x-0 lg:w-64 z-10`}
    >
      <div className="p-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Painel Administrativo
        </h1>
      </div>
      <nav className="py-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 font-medium' : ''
              }`
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
