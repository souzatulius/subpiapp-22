
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  FileText, 
  BarChart2, 
  Settings, 
  TrendingUp
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen
}) => {
  const navItems = [
    // Seção 1: Página Principal
    {
      icon: <Home size={20} />,
      label: 'Início',
      path: '/dashboard'
    },
    // Seção 2: Comunicação
    {
      icon: <MessageCircle size={20} />,
      label: 'Gerenciar Demandas',
      path: '/comunicacao/demandas'
    }, 
    {
      icon: <FileText size={20} />,
      label: 'Notas Oficiais',
      path: '/comunicacao/notas-oficiais'
    },
    {
      icon: <BarChart2 size={20} />,
      label: 'Relatórios',
      path: '/comunicacao/relatorios'
    }, 
    // Seção 3: Zeladoria
    {
      icon: <TrendingUp size={20} />,
      label: 'Ranking das Subs',
      path: '/zeladoria/ranking-subs'
    },
    // Seção 4: Ajustes
    {
      icon: <Settings size={20} className="px-0 mx-0" />,
      label: 'Ajustes',
      path: '/settings'
    }
  ];

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-56' : 'w-16'} flex-shrink-0 overflow-x-hidden`}>
      <nav className="py-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.path} 
                className={({isActive}) => `flex items-center px-4 py-2 ${isActive ? 'text-[#003570] bg-blue-50' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className={`ml-3 ${isOpen ? 'block' : 'hidden'}`}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
