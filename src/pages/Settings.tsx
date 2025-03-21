
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
    }
  }, [location.search]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6 relative">
          {activeSection !== 'dashboard' && (
            <BackButton destination="/settings" />
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
                  {activeSection === 'usuarios' && 'Usuários'}
                  {activeSection === 'areas' && 'Áreas de Coordenação'}
                  {activeSection === 'cargos' && 'Cargos'}
                  {activeSection === 'servicos' && 'Serviços'}
                  {activeSection === 'tipos_midia' && 'Tipos de Mídia'}
                  {activeSection === 'origens_demanda' && 'Origem das Demandas'}
                  {activeSection === 'distritos_bairros' && 'Distritos e Bairros'}
                  {activeSection === 'comunicados' && 'Comunicados'}
                  {activeSection === 'permissoes' && 'Permissões'}
                  {activeSection === 'notificacoes' && 'Notificações'}
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
