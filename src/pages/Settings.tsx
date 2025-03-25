
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SettingsContent from '@/components/settings/SettingsContent';
import SettingsDashboard from '@/components/settings/SettingsDashboard';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get tab from URL query parameter
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

  const toggleSettingsSidebar = () => {
    setSettingsSidebarOpen(!settingsSidebarOpen);
  };

  const handleBackClick = () => {
    // Navigate back to the main settings dashboard
    navigate('/settings');
    setActiveSection('dashboard');
  };

  // Functions to get section details
  const getSectionCategory = (section: string) => {
    if (section === 'dashboard') return 'Dashboard';
    if (['usuarios', 'permissoes', 'cargos'].includes(section)) return 'Gestão de Usuários e Permissões';
    if (['coordenacoes_lista', 'areas', 'servicos'].includes(section)) return 'Gestão Organizacional';
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
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Settings Sidebar for desktop */}
            <div className="hidden md:block w-64 h-full overflow-y-auto border-r border-gray-200 bg-white p-4">
              <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>
            
            {/* Mobile sidebar button and backdrop */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-20 left-2 z-30"
                onClick={toggleSettingsSidebar}
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              {/* Mobile sidebar */}
              {settingsSidebarOpen && (
                <>
                  <div 
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={toggleSettingsSidebar}
                  />
                  <div className="fixed top-0 left-0 h-full w-64 z-50 bg-white p-4 overflow-y-auto">
                    <div className="pb-4 border-b mb-4">
                      <h2 className="text-lg font-semibold">Configurações</h2>
                    </div>
                    <SettingsSidebar 
                      activeSection={activeSection} 
                      setActiveSection={setActiveSection} 
                      isMobile={true}
                    />
                  </div>
                </>
              )}
            </div>
            
            {/* Main content area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-6xl mx-auto">
                {activeSection === 'dashboard' ? (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Configurações</h1>
                    <SettingsDashboard />
                  </div>
                ) : (
                  <div>
                    {/* Local breadcrumbs for settings sections */}
                    <div className="flex items-center mb-2 text-sm">
                      <span className="cursor-pointer hover:underline" onClick={handleBackClick}>Configurações</span>
                      <span className="mx-2">/</span>
                      <span className={`font-medium ${getSectionColor(activeSection)}`}>
                        {getSectionCategory(activeSection)}
                      </span>
                      <span className="mx-2">/</span>
                      <span className="font-medium">{getSectionTitle(activeSection)}</span>
                    </div>
                    
                    <h1 className={`text-2xl font-bold mb-6 ${getSectionColor(activeSection)}`}>
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
    </div>
  );
};

export default Settings;
