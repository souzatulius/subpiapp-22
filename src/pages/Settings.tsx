import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SettingsContent from '@/components/settings/SettingsContent';
import SettingsDashboard from '@/components/settings/SettingsDashboard';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AdminProtectedRoute from '@/components/layouts/AdminProtectedRoute';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Function to handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar isOpen={sidebarOpen} />
          
          <main className="flex-1 overflow-hidden">
            <div className="w-full h-full">
              {/* Main content area */}
              <div className="overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto">
                  {activeSection === 'dashboard' ? (
                    <div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
                        <div className="relative w-full md:w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                          <Input
                            type="text"
                            placeholder="Buscar configurações..."
                            className="pl-10 pr-4 py-2 border-gray-300 rounded-lg w-full"
                            value={searchQuery}
                            onChange={handleSearchChange}
                          />
                        </div>
                      </div>
                      <SettingsDashboard searchQuery={searchQuery} />
                    </div>
                  ) : (
                    <div>
                      {/* Local breadcrumbs for settings sections */}
                      <div className="flex items-center mb-2 text-sm">
                        <span className="cursor-pointer hover:underline" onClick={handleBackClick}>Configurações</span>
                        <span className="mx-2">/</span>
                        <span className={`font-medium`}>
                          {getSectionCategory(activeSection)}
                        </span>
                        <span className="mx-2">/</span>
                        <span className="font-medium">{getSectionTitle(activeSection)}</span>
                      </div>
                      
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
      </div>
    </AdminProtectedRoute>
  );
};

export default Settings;
