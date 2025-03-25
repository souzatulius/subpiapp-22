
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SettingsContent from '@/components/settings/SettingsContent';
import SettingsDashboard from '@/components/settings/SettingsDashboard';
import BackButton from '@/components/layouts/BackButton';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleBackClick = () => {
    // Navigate back to the main settings dashboard
    navigate('/settings');
    setActiveSection('dashboard');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6 relative">
          {activeSection !== 'dashboard' && (
            <BackButton 
              onClick={handleBackClick}
              className="absolute top-6 left-6 z-10"
            />
          )}
          
          <div className="max-w-7xl mx-auto">
            {activeSection === 'dashboard' ? (
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Ajustes</h1>
                <SettingsDashboard />
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-6 pl-16">
                  {activeSection === 'areas' && 'Supervisões Técnicas'}
                  {activeSection === 'coordenacao' && 'Coordenações'}
                  {activeSection === 'cargos' && 'Cargos'}
                  {activeSection === 'problemas' && 'Problemas'}
                  {activeSection === 'servicos' && 'Serviços'}
                  {activeSection === 'tipos_midia' && 'Tipos de Mídia'}
                  {activeSection === 'origens_demanda' && 'Origem das Demandas'}
                  {activeSection === 'distritos_bairros' && 'Distritos e Bairros'}
                  {activeSection === 'comunicados' && 'Comunicados'}
                  {activeSection === 'permissoes' && 'Permissões'}
                  {activeSection === 'notificacoes' && 'Configurações de Notificações'}
                  {activeSection === 'usuarios' && 'Gerenciamento de Usuários'}
                  {activeSection === 'temas' && 'Temas'}
                </h1>
                <SettingsContent activeSection={activeSection} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
