
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, FileText, BarChart2, Users, Settings } from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen }) => {
  const navItems = [
    { icon: <Home size={20} />, label: 'Início', path: '/dashboard' },
    { icon: <ClipboardList size={20} />, label: 'Demandas', path: '/demandas' },
    { icon: <FileText size={20} />, label: 'Notas Oficiais', path: '/notas-oficiais' },
    { icon: <BarChart2 size={20} />, label: 'Relatórios', path: '/relatorios' },
    { icon: <Users size={20} />, label: 'Usuários', path: '/usuarios' },
    { icon: <Settings size={20} />, label: 'Ajustes', path: '/settings' },
  ];

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? 'w-56' : 'w-16'
      } flex-shrink-0 overflow-x-hidden`}
    >
      <nav className="py-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-2 ${isActive ? 'text-[#003570] bg-blue-50' : 'text-gray-600 hover:bg-gray-100'} transition-colors`
                }
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
