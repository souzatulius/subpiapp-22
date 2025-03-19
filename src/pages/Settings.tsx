
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Layers, Briefcase, FileText, Image, Globe, MapPin, Home, MessageSquare, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useSupabaseAuth';
import UsersManagement from '@/components/settings/UsersManagement';
import CoordinationAreas from '@/components/settings/CoordinationAreas';
import Positions from '@/components/settings/Positions';
import Services from '@/components/settings/Services';
import MediaTypes from '@/components/settings/MediaTypes';
import DemandOrigins from '@/components/settings/DemandOrigins';
import DistrictsAndNeighborhoods from '@/components/settings/DistrictsAndNeighborhoods';
import Announcements from '@/components/settings/Announcements';
import AccessControl from '@/components/settings/AccessControl';

const Settings = () => {
  const [activeSection, setActiveSection] = useState<string>("usuarios");
  const navigate = useNavigate();
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'usuarios':
        return <UsersManagement />;
      case 'areas':
        return <CoordinationAreas />;
      case 'cargos':
        return <Positions />;
      case 'servicos':
        return <Services />;
      case 'tipos_midia':
        return <MediaTypes />;
      case 'origens_demanda':
        return <DemandOrigins />;
      case 'distritos_bairros':
        return <DistrictsAndNeighborhoods />;
      case 'comunicados':
        return <Announcements />;
      case 'permissoes':
        return <AccessControl />;
      default:
        return <UsersManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden md:block bg-white w-64 border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#003570]">Ajustes da Plataforma</h2>
          </div>
          <nav className="p-2">
            <ul className="space-y-1">
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'usuarios' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveSection('usuarios')}
                >
                  <Users size={18} />
                  <span className="text-sm font-medium">Usuários</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'areas' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveSection('areas')}
                >
                  <Layers size={18} />
                  <span className="text-sm font-medium">Áreas de Coordenação</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'cargos' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveSection('cargos')}
                >
                  <Briefcase size={18} />
                  <span className="text-sm font-medium">Cargos</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'servicos' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveSection('servicos')}
                >
                  <FileText size={18} />
                  <span className="text-sm font-medium">Serviços</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'tipos_midia' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveSection('tipos_midia')}
                >
                  <Image size={18} />
                  <span className="text-sm font-medium">Tipos de Mídia</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'origens_demanda' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveSection('origens_demanda')}
                >
                  <Globe size={18} />
                  <span className="text-sm font-medium">Origem das Demandas</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'distritos_bairros' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveSection('distritos_bairros')}
                >
                  <MapPin size={18} />
                  <span className="text-sm font-medium">Distritos e Bairros</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'comunicados' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveSection('comunicados')}
                >
                  <MessageSquare size={18} />
                  <span className="text-sm font-medium">Comunicados</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'permissoes' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveSection('permissoes')}
                >
                  <Shield size={18} />
                  <span className="text-sm font-medium">Permissões</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {/* Mobile top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => navigate('/dashboard')}
                  className="md:flex"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-xl md:text-2xl font-bold text-[#003570]">Ajustes da Plataforma</h1>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const dropdown = document.getElementById('mobile-menu');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }}
                >
                  Menu
                </Button>
              </div>
            </div>
            
            {/* Mobile dropdown menu */}
            <div id="mobile-menu" className="hidden md:hidden mb-6 bg-white rounded-lg shadow-sm p-2">
              <ul className="space-y-1">
                <li>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'usuarios' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setActiveSection('usuarios');
                      document.getElementById('mobile-menu')?.classList.add('hidden');
                    }}
                  >
                    <Users size={18} />
                    <span className="text-sm font-medium">Usuários</span>
                  </button>
                </li>
                {/* Repeat for other menu items */}
                <li>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'areas' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setActiveSection('areas');
                      document.getElementById('mobile-menu')?.classList.add('hidden');
                    }}
                  >
                    <Layers size={18} />
                    <span className="text-sm font-medium">Áreas de Coordenação</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'cargos' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setActiveSection('cargos');
                      document.getElementById('mobile-menu')?.classList.add('hidden');
                    }}
                  >
                    <Briefcase size={18} />
                    <span className="text-sm font-medium">Cargos</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'servicos' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setActiveSection('servicos');
                      document.getElementById('mobile-menu')?.classList.add('hidden');
                    }}
                  >
                    <FileText size={18} />
                    <span className="text-sm font-medium">Serviços</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'tipos_midia' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setActiveSection('tipos_midia');
                      document.getElementById('mobile-menu')?.classList.add('hidden');
                    }}
                  >
                    <Image size={18} />
                    <span className="text-sm font-medium">Tipos de Mídia</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'origens_demanda' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setActiveSection('origens_demanda');
                      document.getElementById('mobile-menu')?.classList.add('hidden');
                    }}
                  >
                    <Globe size={18} />
                    <span className="text-sm font-medium">Origem das Demandas</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'distritos_bairros' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setActiveSection('distritos_bairros');
                      document.getElementById('mobile-menu')?.classList.add('hidden');
                    }}
                  >
                    <MapPin size={18} />
                    <span className="text-sm font-medium">Distritos e Bairros</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'comunicados' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setActiveSection('comunicados');
                      document.getElementById('mobile-menu')?.classList.add('hidden');
                    }}
                  >
                    <MessageSquare size={18} />
                    <span className="text-sm font-medium">Comunicados</span>
                  </button>
                </li>
                <li>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${activeSection === 'permissoes' ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setActiveSection('permissoes');
                      document.getElementById('mobile-menu')?.classList.add('hidden');
                    }}
                  >
                    <Shield size={18} />
                    <span className="text-sm font-medium">Permissões</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Main content area */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
