
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Fixed breadcrumb for mobile */}
        {isMobile && (
          <div className="fixed top-0 left-0 right-0 z-40 bg-white">
            <BreadcrumbBar onSettingsClick={handleBackClick} />
          </div>
        )}
        
        {/* Header with fade effect on mobile */}
        <div 
          style={isMobile ? scrollFadeStyles : undefined}
          className={`${isMobile ? 'transition-all duration-300' : ''}`}
        >
          <Header showControls={true} toggleSidebar={toggleSidebar} />
        </div>
        
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Somente mostrar sidebar no desktop */}
          {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
          
          <main className={`flex-1 overflow-hidden flex flex-col ${isMobile ? 'pt-10' : ''}`}>
            {/* Desktop breadcrumb */}
            {!isMobile && <BreadcrumbBar onSettingsClick={handleBackClick} />}
            
            <div className="max-w-full mx-auto flex-1">
              <div className={`overflow-y-auto p-4 h-full ${isMobile ? 'pb-32' : 'pb-4'}`}>
                {activeSection === 'dashboard' ? (
                  <div
                    style={isMobile ? scrollFadeStyles : undefined}
                    className={`${isMobile ? 'transition-all duration-300' : ''}`}
                  >
                    <SettingsDashboard searchQuery={searchQuery} />
                  </div>
                ) : (
                  <div>
                    <h1 
                      className={`text-2xl font-bold mb-6`}
                      style={isMobile ? scrollFadeStyles : undefined}
                    >
                      {getSectionTitle(activeSection)}
                    </h1>
                    <SettingsContent activeSection={activeSection} />
                  </div>
                )}
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
