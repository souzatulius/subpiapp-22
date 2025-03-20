
import React, { useState, useEffect } from 'react';
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
  Search,
  BookOpen
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    comunicacao: true,
    impresa: true,
    notas: true,
    relatorios: true,
    zeladoria: true
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const checkAdminStatus = async () => {
        try {
          // Check if user has admin privileges
          const { data, error } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (error) throw error;
          setIsAdmin(!!data);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      };
      
      checkAdminStatus();
    }
  }, [user]);

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
    // Seção 3: Relatórios
    {
      id: 'relatorios',
      icon: <BarChart2 size={20} />,
      label: 'Relatórios',
      isSection: true,
      items: [
        {
          icon: <BarChart2 size={18} />,
          label: 'Números da Comunicação',
          path: '/dashboard/comunicacao/relatorios'
        }
      ]
    },
    // Seção 4: Zeladoria
    {
      id: 'zeladoria',
      icon: <TrendingUp size={20} />,
      label: 'Zeladoria',
      isSection: true,
      items: [
        {
          icon: <TrendingUp size={18} />,
          label: 'Ranking das Subs',
          path: '/dashboard/zeladoria/ranking-subs'
        }
      ]
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

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-56' : 'w-16'} flex-shrink-0 overflow-x-hidden`}>
      <nav className="py-4">
        <ul className="space-y-1">
          {navSections.filter(section => !section.adminOnly || isAdmin).map((section) => (
            <li key={section.id} className="flex flex-col">
              {section.isSection ? (
                <>
                  <button 
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                  >
                    <div className="flex-shrink-0">{section.icon}</div>
                    {isOpen && (
                      <span className="ml-3">{section.label}</span>
                    )}
                  </button>
                  
                  {isOpen && expandedSections[section.id] && section.subSections && (
                    <>
                      {section.subSections.map((subSection) => (
                        <div key={subSection.id} className="ml-4 mt-1">
                          <button 
                            onClick={() => toggleSection(subSection.id)}
                            className="flex items-center px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors w-full text-left text-sm font-medium"
                          >
                            <span>{subSection.label}</span>
                          </button>
                          
                          {expandedSections[subSection.id] && (
                            <ul className="ml-2 space-y-1">
                              {subSection.items?.map((item, index) => (
                                <li key={`${subSection.id}-item-${index}`}>
                                  <NavLink 
                                    to={item.path} 
                                    className={({isActive}) => `flex items-center py-1.5 px-3 ${isActive ? 'text-[#003570] bg-blue-50' : 'text-gray-600 hover:bg-gray-100'} rounded-md transition-colors text-sm`}
                                  >
                                    <div className="flex-shrink-0 mr-2">{item.icon}</div>
                                    <span>{item.label}</span>
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                  
                  {isOpen && expandedSections[section.id] && section.items && (
                    <ul className="ml-6 space-y-1 mt-1">
                      {section.items?.map((item, index) => (
                        <li key={`${section.id}-item-${index}`}>
                          <NavLink 
                            to={item.path} 
                            className={({isActive}) => `flex items-center py-1.5 px-2 ${isActive ? 'text-[#003570] bg-blue-50' : 'text-gray-600 hover:bg-gray-100'} rounded-md transition-colors text-sm`}
                          >
                            <div className="flex-shrink-0 mr-2">{item.icon}</div>
                            <span>{item.label}</span>
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
