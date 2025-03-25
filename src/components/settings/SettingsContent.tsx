
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
import NotificationsPage from './notifications/NotificationsPage';
import Temas from './Temas';
import CoordinationsList from './coordination/CoordinationsList';

interface SettingsContentProps {
  activeSection: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ activeSection }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Gestão de Usuários e Permissões */}
      {activeSection === 'usuarios' && <UsersManagement />}
      {activeSection === 'cargos' && <Positions />}
      
      {/* Gestão Organizacional */}
      {activeSection === 'coordenacoes_lista' && <CoordinationsList />}
      {activeSection === 'areas' && <CoordinationAreas />}
      {activeSection === 'servicos' && <Services />}
      
      {/* Gestão Operacional - Demandas */}
      {activeSection === 'origens_demanda' && <DemandOrigins />}
      {activeSection === 'problemas' && <Temas />}
      {activeSection === 'tipos_midia' && <MediaTypes />}
      {activeSection === 'distritos_bairros' && <DistrictsAndNeighborhoods />}
      
      {/* Gestão Operacional - Comunicação */}
      {activeSection === 'notificacoes' && <NotificationsPage />}
      {activeSection === 'comunicados' && <Announcements />}
    </div>
  );
};

export default SettingsContent;
