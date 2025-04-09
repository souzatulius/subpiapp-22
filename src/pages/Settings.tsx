
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SettingsContent from '@/components/settings/SettingsContent';
import SettingsDashboard from '@/components/settings/SettingsDashboard';
import MobileSettingsNav from '@/components/settings/MobileSettingsNav';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import AdminProtectedRoute from '@/components/layouts/AdminProtectedRoute';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollFade } from '@/hooks/useScrollFade';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const scrollFadeStyles = useScrollFade({ threshold: 10, fadeDistance: 80 });
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveSection(tab);
    } else {
      setActiveSection('dashboard');
    }
  }, [location.search]);
  
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true');
    }
  }, []);
  
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', String(newState));
  };

  const handleBackClick = () => {
    navigate('/settings');
    setActiveSection('dashboard');
  };
  
  return (
    <AdminProtectedRoute>
      <div className="flex flex-col h-screen bg-[#FFFAFA]">
        {/* Header */}
        <div 
          style={isMobile ? scrollFadeStyles : undefined}
          className={`${isMobile ? 'transition-all duration-300' : ''} flex-shrink-0`}
        >
          <Header showControls={true} toggleSidebar={toggleSidebar} />
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Only show sidebar on desktop */}
          {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
          
          <main className={`flex-1 flex flex-col overflow-auto ${isMobile ? 'pt-0' : ''} bg-[#FFFAFA]`}>
            {/* Desktop breadcrumb - only show on desktop before content */}
            {!isMobile && <BreadcrumbBar onSettingsClick={handleBackClick} className="flex-shrink-0" />}
            
            <div className="flex-1 overflow-auto w-full max-w-full mx-auto">
              <div className={`p-4 ${isMobile ? 'pb-16' : 'pb-4'} h-full flex flex-col`}>
                {activeSection === 'dashboard' ? (
                  <div
                    style={isMobile ? scrollFadeStyles : undefined}
                    className={`${isMobile ? 'transition-all duration-300' : ''} flex-1 flex flex-col`}
                  >
                    {/* Mobile breadcrumb - directly attached to the top of WelcomeCard with no margin */}
                    {isMobile && <div className="mb-0 sticky top-0 z-10 flex-shrink-0"><BreadcrumbBar onSettingsClick={handleBackClick} /></div>}
                    
                    <div className="flex-1">
                      <SettingsDashboard searchQuery={searchQuery} />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <h1 
                      className={`text-2xl font-bold mb-6 flex-shrink-0`}
                      style={isMobile ? scrollFadeStyles : undefined}
                    >
                      {getSectionTitle(activeSection)}
                    </h1>
                    
                    {/* Mobile breadcrumb for non-dashboard sections */}
                    {isMobile && <div className="mb-4 sticky top-0 z-10 flex-shrink-0"><BreadcrumbBar onSettingsClick={handleBackClick} /></div>}
                    
                    <div className="flex-1 overflow-auto">
                      <SettingsContent activeSection={activeSection} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
        
        {/* Bottom Navigation for Mobile */}
        {isMobile && <MobileSettingsNav />}
      </div>
    </AdminProtectedRoute>
  );
};

// Helper functions for section names
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

export default Settings;
