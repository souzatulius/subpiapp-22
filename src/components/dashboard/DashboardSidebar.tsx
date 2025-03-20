
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    comunicacao: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Main navigation sections
  const navSections = [
    // Seção 1: Página Principal
    {
      id: 'inicio',
      icon: <Home size={20} />,
      label: 'Início',
      path: '/dashboard',
      hasChildren: false
    },
    // Seção 2: Comunicação
    {
      id: 'comunicacao',
      icon: <MessageCircle size={20} />,
      label: 'Comunicação',
      path: null,
      hasChildren: true,
      children: [
        {
          icon: <PlusCircle size={18} />,
          label: 'Cadastrar Demanda',
          path: '/dashboard/comunicacao/cadastrar'
        },
        {
          icon: <MessageSquareReply size={18} />,
          label: 'Responder Demandas',
          path: '/dashboard/comunicacao/responder'
        },
        {
          icon: <FileText size={18} />,
          label: 'Criar Nota Oficial',
          path: '/dashboard/comunicacao/criar-nota'
        },
        {
          icon: <FileCheck size={18} />,
          label: 'Aprovar Nota Oficial',
          path: '/dashboard/comunicacao/aprovar-nota'
        },
        {
          icon: <BarChart2 size={18} />,
          label: 'Relatórios',
          path: '/dashboard/comunicacao/relatorios'
        }
      ]
    }, 
    // Seção 3: Zeladoria
    {
      id: 'zeladoria',
      icon: <TrendingUp size={20} />,
      label: 'Zeladoria',
      path: '/dashboard/zeladoria/ranking-subs',
      hasChildren: false
    },
    // Seção 4: Ajustes
    {
      id: 'ajustes',
      icon: <Settings size={20} className="px-0 mx-0" />,
      label: 'Ajustes',
      path: '/settings',
      hasChildren: false
    }
  ];

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-56' : 'w-16'} flex-shrink-0 overflow-x-hidden`}>
      <nav className="py-4">
        <ul className="space-y-2">
          {navSections.map((section) => (
            <li key={section.id} className="flex flex-col">
              {section.hasChildren ? (
                <>
                  <button 
                    onClick={() => toggleSection(section.id)}
                    className={`flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors`}
                  >
                    <div className="flex-shrink-0">{section.icon}</div>
                    {isOpen && (
                      <>
                        <span className="ml-3">{section.label}</span>
                        <div className="ml-auto">
                          {expandedSections[section.id] ? 
                            <ChevronDown size={16} /> : 
                            <ChevronRight size={16} />
                          }
                        </div>
                      </>
                    )}
                  </button>
                  
                  {isOpen && expandedSections[section.id] && (
                    <ul className="pl-8 space-y-1 mt-1">
                      {section.children?.map((child, childIndex) => (
                        <li key={`${section.id}-child-${childIndex}`}>
                          <NavLink 
                            to={child.path} 
                            className={({isActive}) => `flex items-center py-1.5 px-2 text-sm ${isActive ? 'text-[#003570] bg-blue-50' : 'text-gray-600 hover:bg-gray-100'} rounded-md transition-colors`}
                          >
                            <div className="flex-shrink-0 mr-2">{child.icon}</div>
                            <span>{child.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink 
                  to={section.path || '#'} 
                  className={({isActive}) => `flex items-center px-4 py-2 ${isActive ? 'text-[#003570] bg-blue-50' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                >
                  <div className="flex-shrink-0">{section.icon}</div>
                  <span className={`ml-3 ${isOpen ? 'block' : 'hidden'}`}>{section.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
