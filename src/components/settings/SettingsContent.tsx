
import React from 'react';
import UsersManagement from './UsersManagement';
import CoordinationAreas from './CoordinationAreas';
import Positions from './Positions';
import Services from './Services';
import MediaTypes from './MediaTypes';
import DemandOrigins from './DemandOrigins';
import DistrictsAndNeighborhoods from './DistrictsAndNeighborhoods';
import Announcements from './Announcements';
import AccessControl from './AccessControl';
import NotificationsSettings from './notifications/NotificationsSettings';
import Temas from './Temas';
import CoordinationArea from './coordination/CoordinationArea';
import CoordinationsList from './coordination/CoordinationsList';
// Import Problem, Teams components if available

interface SettingsContentProps {
  activeSection: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ activeSection }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {activeSection === 'usuarios' && <UsersManagement />}
      {activeSection === 'permissoes' && <AccessControl />}
      
      {activeSection === 'cargos' && <Positions />}
      {activeSection === 'coordenacao' && <CoordinationArea />}
      {activeSection === 'areas' && <CoordinationAreas />}
      {activeSection === 'coordenacoes_lista' && <CoordinationsList />}
      {activeSection === 'equipes' && <div className="text-center p-10 text-gray-500">Gerenciamento de Equipes em desenvolvimento</div>}
      
      {activeSection === 'origens_demanda' && <DemandOrigins />}
      {activeSection === 'problemas' && <div className="text-center p-10 text-gray-500">Gerenciamento de Problemas em desenvolvimento</div>}
      {activeSection === 'tipos_midia' && <MediaTypes />}
      {activeSection === 'servicos' && <Services />}
      {activeSection === 'distritos_bairros' && <DistrictsAndNeighborhoods />}
      {activeSection === 'notificacoes' && <NotificationsSettings />}
      {activeSection === 'comunicados' && <Announcements />}
      
      {activeSection === 'temas' && <Temas />}
    </div>
  );
};

export default SettingsContent;
