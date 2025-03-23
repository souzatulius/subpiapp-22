
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
import Notifications from './Notifications';
import NotificationsSettings from './notifications/NotificationsSettings';

interface SettingsContentProps {
  activeSection: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ activeSection }) => {
  return (
    <div>
      {activeSection === 'usuarios' && <UsersManagement />}
      {activeSection === 'areas' && <CoordinationAreas />}
      {activeSection === 'cargos' && <Positions />}
      {activeSection === 'servicos' && <Services />}
      {activeSection === 'tipos_midia' && <MediaTypes />}
      {activeSection === 'origens_demanda' && <DemandOrigins />}
      {activeSection === 'distritos_bairros' && <DistrictsAndNeighborhoods />}
      {activeSection === 'comunicados' && <Announcements />}
      {activeSection === 'notificacoes' && <NotificationsSettings />}
      {activeSection === 'permissoes' && <AccessControl />}
    </div>
  );
};

export default SettingsContent;
