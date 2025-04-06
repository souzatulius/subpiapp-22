
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
  
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Somente mostrar sidebar no desktop */}
          {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
          
          <main className="flex-1 overflow-hidden">
            <BreadcrumbBar onSettingsClick={handleBackClick} />
            <div className="max-w-full mx-auto">
              <div className="overflow-y-auto p-4 pb-24 md:pb-4">
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
