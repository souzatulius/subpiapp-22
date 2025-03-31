
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SettingsContent from '@/components/settings/SettingsContent';
import SettingsDashboard from '@/components/settings/SettingsDashboard';
import MobileSettingsNav from '@/components/settings/MobileSettingsNav';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AdminProtectedRoute from '@/components/layouts/AdminProtectedRoute';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveSection(tab);
    } else {
      setActiveSection('dashboard');
    }
  }, [location.search]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBackClick = () => {
    navigate('/settings');
    setActiveSection('dashboard');
  };

  const getSectionCategory = (section: string) => {
    if (section === 'dashboard') return 'Dashboard';
    if (['usuarios', 'permissoes', 'cargos'].includes(section)) return 'Gestão de Usuários e Permissões';
    if (['coordenacoes_lista', 'areas', 'servicos', 'dashboard_management'].includes(section)) return 'Gestão Organizacional';
    if (['origens_demanda', 'problemas', 'tipos_midia', 'distritos_bairros', 'notificacoes', 'comunicados'].includes(section)) return 'Gestão Operacional';
    return '';
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'dashboard': return 'Dashboard';
      case 'usuarios': return 'Usuários e Permissões';
      case 'cargos': return 'Cargos';
      case 'coordenacoes_lista': return 'Coordenações';
      case 'areas': return 'Supervisões Técnicas';
      case 'servicos': return 'Serviços';
      case 'origens_demanda': return 'Origem das Demandas';
      case 'problemas': return 'Problemas/Temas';
      case 'tipos_midia': return 'Tipos de Mídia';
      case 'distritos_bairros': return 'Distritos e Bairros';
      case 'notificacoes': return 'Notificações';
      case 'comunicados': return 'Avisos e Comunicados';
      case 'dashboard_management': return 'Gerenciamento de Dashboards';
      default: return '';
    }
  };

  const getSectionColor = (section: string) => {
    const category = getSectionCategory(section);
    if (category === 'Gestão de Usuários e Permissões') return 'text-amber-600';
    if (category === 'Gestão Organizacional') return 'text-blue-600';
    if (category === 'Gestão Operacional') return 'text-green-600';
    return 'text-gray-800';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Somente mostrar sidebar no desktop */}
          {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
          
          <main className="flex-1 overflow-hidden">
            <div className="w-full h-full">
              <div className="overflow-y-auto p-6 pb-24 md:pb-6">
                <div className="max-w-7xl mx-auto">
                  {activeSection !== 'dashboard' && (
                    <div className="mb-4">
                      <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                          <li>
                            <button
                              onClick={handleBackClick}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Configurações
                            </button>
                          </li>
                          <li className="text-gray-500 flex items-center">
                            <span className="mx-1">/</span>
                            <span className={`${getSectionColor(activeSection)} font-medium`}>
                              {getSectionTitle(activeSection)}
                            </span>
                          </li>
                        </ol>
                      </nav>
                    </div>
                  )}
                  
                  {activeSection === 'dashboard' ? (
                    <div>
                      <SettingsDashboard searchQuery={searchQuery} />
                    </div>
                  ) : (
                    <div>
                      <h1 className={`text-2xl font-bold mb-6`}>
                        {getSectionTitle(activeSection)}
                      </h1>
                      <SettingsContent activeSection={activeSection} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
        
        {/* Bottom Navigation for Mobile */}
        <MobileSettingsNav />
      </div>
    </AdminProtectedRoute>
  );
};

export default Settings;
